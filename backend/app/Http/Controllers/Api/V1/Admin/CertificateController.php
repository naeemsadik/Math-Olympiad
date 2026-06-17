<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CertificateResource;
use App\Models\Certificate;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CertificateController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Certificate::query();
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        if ($tier = $request->query('tier')) {
            $query->where('tier', $tier);
        }
        if ($search = $request->query('search')) {
            $query->where(fn ($q) => $q
                ->where('certificate_id', 'like', "%{$search}%")
                ->orWhere('recipient_name', 'like', "%{$search}%"));
        }
        $certificates = $query->orderByDesc('id')->paginate(25);

        return response()->json([
            'data' => CertificateResource::collection($certificates->items()),
            'meta' => [
                'current_page' => $certificates->currentPage(),
                'last_page' => $certificates->lastPage(),
                'total' => $certificates->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:200',
            'description' => 'nullable|string',
            'tier' => ['required', Rule::in(['Beginner', 'Intermediate', 'Advanced', 'Elite'])],
            'score' => 'nullable|numeric|min:0|max:100',
            'issued_at' => 'required|date',
            'valid_until' => 'nullable|date|after:issued_at',
            'signatory_name' => 'nullable|string|max:160',
            'signatory_title' => 'nullable|string|max:160',
        ]);

        $user = User::findOrFail($data['user_id']);
        $data['recipient_name'] = $user->name;
        $data['certificate_id'] = $this->generateCertificateId($data['issued_at']);
        $data['status'] = 'active';

        $certificate = Certificate::create($data);
        return response()->json(['data' => new CertificateResource($certificate)], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $certificate = Certificate::findOrFail($id);
        $data = $request->validate([
            'title' => 'sometimes|string|max:200',
            'description' => 'nullable|string',
            'tier' => ['sometimes', Rule::in(['Beginner', 'Intermediate', 'Advanced', 'Elite'])],
            'score' => 'nullable|numeric|min:0|max:100',
            'valid_until' => 'nullable|date',
            'signatory_name' => 'nullable|string|max:160',
            'signatory_title' => 'nullable|string|max:160',
        ]);
        $certificate->fill($data)->save();
        return response()->json(['data' => new CertificateResource($certificate)]);
    }

    public function destroy(string $id): JsonResponse
    {
        Certificate::findOrFail($id)->delete();
        return response()->json(['message' => 'Certificate deleted.']);
    }

    public function revoke(Request $request, string $id): JsonResponse
    {
        $certificate = Certificate::findOrFail($id);
        $data = $request->validate([
            'reason' => 'required|string|max:500',
        ]);
        $certificate->update([
            'status' => 'revoked',
            'revoked_at' => now(),
            'revoke_reason' => $data['reason'],
        ]);
        return response()->json(['data' => new CertificateResource($certificate)]);
    }

    public function restore(string $id): JsonResponse
    {
        $certificate = Certificate::findOrFail($id);
        $certificate->update([
            'status' => 'active',
            'revoked_at' => null,
            'revoke_reason' => null,
        ]);
        return response()->json(['data' => new CertificateResource($certificate)]);
    }

    public function exportCsv(Request $request): StreamedResponse
    {
        $query = Certificate::query();
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        if ($tier = $request->query('tier')) {
            $query->where('tier', $tier);
        }
        $certificates = $query->orderBy('id')->get();

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="certificates_'.now()->format('Ymd_His').'.csv"',
        ];

        return response()->stream(function () use ($certificates) {
            $out = fopen('php://output', 'w');
            fputcsv($out, [
                'Certificate ID', 'Recipient', 'Title', 'Tier', 'Score',
                'Issued', 'Valid Until', 'Status', 'Revoked At', 'Revoke Reason',
            ]);
            foreach ($certificates as $c) {
                fputcsv($out, [
                    $c->certificate_id,
                    $c->recipient_name,
                    $c->title,
                    $c->tier,
                    $c->score,
                    $c->issued_at?->toDateString(),
                    $c->valid_until?->toDateString(),
                    $c->status,
                    $c->revoked_at?->toIso8601String(),
                    $c->revoke_reason,
                ]);
            }
            fclose($out);
        }, 200, $headers);
    }

    protected function generateCertificateId(string $issuedAt): string
    {
        $year = (int) date('Y', strtotime($issuedAt));
        $last = Certificate::where('certificate_id', 'like', "UIU-CMOR-{$year}-%")
            ->orderByDesc('certificate_id')
            ->value('certificate_id');
        $next = 1;
        if ($last && preg_match('/-(\d+)$/', $last, $m)) {
            $next = ((int) $m[1]) + 1;
        }
        return sprintf('UIU-CMOR-%d-%03d', $year, $next);
    }
}
