<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\CertificateResource;
use App\Models\Certificate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    /**
     * GET /api/v1/certificates/verify?type=id&q=UIU-CMOR-2025-001
     *    or  ?type=regNo&q=2025-001-001
     */
    public function verify(Request $request): JsonResponse
    {
        $type = $request->query('type', 'id');
        $q = trim((string) $request->query('q'));

        if (! $q) {
            return response()->json([
                'message' => 'Query parameter q is required.',
            ], 422);
        }

        $cert = match ($type) {
            'regNo' => Certificate::where('student_id_str', 'like', "%{$q}%")->first(),
            default  => Certificate::where('id', $q)->first(),
        };

        if (! $cert) {
            return response()->json([
                'found' => false,
                'message' => 'No certificate found for the given query.',
            ], 404);
        }

        return response()->json([
            'found' => true,
            'certificate' => new CertificateResource($cert),
        ]);
    }
}
