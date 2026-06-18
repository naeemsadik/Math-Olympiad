<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $primaryKey = 'key';
    protected $keyType = 'string';

    protected $fillable = ['key', 'value', 'type'];

    public static function get(string $key, mixed $default = null): mixed
    {
        $row = static::find($key);
        if (! $row) return $default;
        return match ($row->type) {
            'json'    => json_decode($row->value, true),
            'boolean' => filter_var($row->value, FILTER_VALIDATE_BOOL),
            'integer' => (int) $row->value,
            default   => $row->value,
        };
    }

    public static function put(string $key, mixed $value, string $type = 'string'): void
    {
        $stored = match ($type) {
            'json'    => json_encode($value),
            'boolean' => $value ? '1' : '0',
            default   => (string) $value,
        };

        static::updateOrCreate(['key' => $key], ['value' => $stored, 'type' => $type]);
    }
}
