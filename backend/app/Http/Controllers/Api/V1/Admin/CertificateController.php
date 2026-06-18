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
                ->where('id', 'like', "%{$search}%")
                ->orWhere('student_name', 'like', "%{$search}%"));
        }
        $certificates = $query->orderByDesc('issued_at')->paginate(25);

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
            'user_id' => 'nullable|exists:users,id',
            'student_name' => 'required|string|max:160',
            'student_id_str' => 'nullable|string|max:60',
            'dept' => 'nullable|string|max:120',
            'institute' => 'nullable|string|max:190',
            'achievement' => 'required|string|max:200',
            'event' => 'nullable|string|max:200',
            'event_type' => 'nullable|string|max:60',
            'description' => 'nullable|string',
            'issued_at' => 'required|date',
            'tier' => ['required', Rule::in(['gold', 'silver', 'bronze'])],
            'signatory_name' => 'nullable|string|max:160',
            'signatory_title' => 'nullable|string|max:160',
        ]);

        if (! empty($data['user_id'])) {
            $user = User::findOrFail($data['user_id']);
            $data['student_name'] = $data['student_name'] ?: $user->name;
        }
        $data['id'] = $this->generateCertificateId($data['issued_at']);
        $data['status'] = 'valid';

        $certificate = Certificate::create($data);
        return response()->json(['data' => new CertificateResource($certificate)], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $certificate = Certificate::findOrFail($id);
        $data = $request->validate([
            'student_name' => 'sometimes|string|max:160',
            'student_id_str' => 'nullable|string|max:60',
            'dept' => 'nullable|string|max:120',
            'institute' => 'nullable|string|max:190',
            'achievement' => 'sometimes|string|max:200',
            'event' => 'nullable|string|max:200',
            'event_type' => 'nullable|string|max:60',
            'description' => 'nullable|string',
            'issued_at' => 'sometimes|date',
            'tier' => ['sometimes', Rule::in(['gold', 'silver', 'bronze'])],
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
            'status' => 'valid',
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
                'Certificate ID', 'Recipient', 'Achievement', 'Event', 'Tier',
                'Issued', 'Status', 'Revoked At', 'Revoke Reason',
            ]);
            foreach ($certificates as $c) {
                fputcsv($out, [
                    $c->id,
                    $c->student_name,
                    $c->achievement,
                    $c->event,
                    $c->tier,
                    $c->issued_at?->toDateString(),
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
        $last = Certificate::where('id', 'like', "UIU-CMOR-{$year}-%")
            ->orderByDesc('id')
            ->value('id');
        $next = 1;
        if ($last && preg_match('/-(\d+)$/', $last, $m)) {
            $next = ((int) $m[1]) + 1;
        }
        return sprintf('UIU-CMOR-%d-%03d', $year, $next);
    }
}
