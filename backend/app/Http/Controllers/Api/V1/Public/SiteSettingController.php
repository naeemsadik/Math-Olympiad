<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;

class SiteSettingController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = SiteSetting::all()->mapWithKeys(fn ($row) => [
            $row->key => match ($row->type) {
                'json'    => json_decode($row->value, true),
                'boolean' => filter_var($row->value, FILTER_VALIDATE_BOOL),
                'integer' => (int) $row->value,
                default   => $row->value,
            },
        ]);

        return response()->json(['data' => $settings]);
    }
}
