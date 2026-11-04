<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Badge;
use Illuminate\Http\Request;

class BadgeController extends Controller
{
    /**
     * Display a listing of user's badges.
     */
    public function index(Request $request)
    {
        $badges = $request->user()->badges()
            ->latest('updated_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $badges,
        ]);
    }

    /**
     * Store a newly created badge in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'badge_type' => 'nullable|string|max:100',
            'access_level' => 'nullable|string|max:100',
            'size_preset' => 'nullable|string|max:50',
            'orientation' => 'nullable|string|in:portrait,landscape',
            'width' => 'nullable|numeric',
            'height' => 'nullable|numeric',
            'unit' => 'nullable|string|max:10',
            'page_config' => 'nullable|array',
            'front_boxes' => 'nullable|array',
            'back_boxes' => 'nullable|array',
            'layers' => 'nullable|array',
            'settings' => 'nullable|array',
            'preview_image' => 'nullable|string',
        ]);

        $preset = $validated['size_preset'] ?? 'A6';
        $orientation = $validated['orientation'] ?? 'portrait';
        $width = $validated['width'] ?? ($preset === 'A4' ? 210 : ($preset === 'A7' ? 74 : 105));
        $height = $validated['height'] ?? ($preset === 'A4' ? 297 : ($preset === 'A7' ? 105 : 148));

        if ($orientation === 'landscape' && $width < $height) {
            $tmp = $width;
            $width = $height;
            $height = $tmp;
        }

        $badge = $request->user()->badges()->create([
            'title' => $validated['title'] ?? ($validated['badge_type'] ? $validated['badge_type'] . ' Badge' : 'New Badge'),
            'badge_type' => $validated['badge_type'] ?? 'Attendee',
            'access_level' => $validated['access_level'] ?? 'General',
            'size_preset' => $preset,
            'orientation' => $orientation,
            'width' => $width,
            'height' => $height,
            'unit' => $validated['unit'] ?? 'mm',
            'active_side' => 'front',
            'page_config' => $validated['page_config'] ?? [
                'badgeSizePreset' => $preset,
                'badgeSize' => $preset,
                'badgeOrientation' => $orientation,
                'customWidth' => $width,
                'customHeight' => $height,
            ],
            'front_boxes' => $validated['front_boxes'] ?? [],
            'back_boxes' => $validated['back_boxes'] ?? [],
            'layers' => $validated['layers'] ?? [],
            'settings' => $validated['settings'] ?? [],
            'preview_image' => $validated['preview_image'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Badge created successfully.',
            'data' => $badge,
        ], 201);
    }

    /**
     * Display the specified badge.
     */
    public function show(Request $request, string $id)
    {
        $badge = $request->user()->badges()->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $badge,
        ]);
    }

    /**
     * Update the specified badge in storage.
     */
    public function update(Request $request, string $id)
    {
        $badge = $request->user()->badges()->findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|nullable|string|max:255',
            'badge_type' => 'sometimes|nullable|string|max:100',
            'access_level' => 'sometimes|nullable|string|max:100',
            'size_preset' => 'sometimes|nullable|string|max:50',
            'orientation' => 'sometimes|nullable|string|in:portrait,landscape',
            'width' => 'sometimes|nullable|numeric',
            'height' => 'sometimes|nullable|numeric',
            'unit' => 'sometimes|nullable|string|max:10',
            'active_side' => 'sometimes|nullable|string|in:front,back',
            'page_config' => 'sometimes|nullable|array',
            'front_boxes' => 'sometimes|nullable|array',
            'back_boxes' => 'sometimes|nullable|array',
            'layers' => 'sometimes|nullable|array',
            'settings' => 'sometimes|nullable|array',
            'preview_image' => 'sometimes|nullable|string',
        ]);

        $badge->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Badge saved successfully.',
            'data' => $badge,
        ]);
    }

    /**
     * Duplicate an existing badge.
     */
    public function duplicate(Request $request, string $id)
    {
        $source = $request->user()->badges()->findOrFail($id);

        $clone = $source->replicate([
            'id',
            'created_at',
            'updated_at',
        ]);
        $clone->title = $source->title . ' (Copy)';
        $clone->save();

        return response()->json([
            'success' => true,
            'message' => 'Badge duplicated successfully.',
            'data' => $clone,
        ], 201);
    }

    /**
     * Remove the specified badge from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $badge = $request->user()->badges()->findOrFail($id);
        $badge->delete();

        return response()->json([
            'success' => true,
            'message' => 'Badge deleted successfully.',
        ]);
    }
}

