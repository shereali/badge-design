<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    /**
     * Upload an image (avatar, logo, badge element).
     */
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|image|max:20480', // 20MB max
        ]);

        $file = $request->file('file');
        $userId = $request->user() ? $request->user()->id : 'public';
        $path = $file->store('uploads/' . $userId, 'public');

        return response()->json([
            'success' => true,
            'url' => Storage::url($path),
            'filename' => $file->getClientOriginalName(),
            'size' => $file->getSize(),
        ], 201);
    }
}
