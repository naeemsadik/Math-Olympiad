<?php

namespace App\Models\Traits;

use Spatie\Activitylog\LogOptions;

trait HasActivityLog
{
    public function getActivitylogOptions(): LogOptions
    {
        $attrs = property_exists($this, 'logAttributes') ? $this->logAttributes : ['*'];
        $logName = property_exists($this, 'logName') ? $this->logName : strtolower(class_basename($this));
        $onlyDirty = property_exists($this, 'logOnlyDirty') ? $this->logOnlyDirty : true;

        return LogOptions::defaults()
            ->logOnly($attrs)
            ->logOnlyDirty($onlyDirty)
            ->useLogName($logName)
            ->dontSubmitEmptyLogs();
    }
}
