<?php

namespace App\Http\Controllers;

use App\Models\LearningMaterial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;

class LearningMaterialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $materials = LearningMaterial::orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $materials
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'level' => 'required|string|max:255',
            'skills' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx|max:5120', // Max 5MB
            'file_base64' => 'nullable|string', // Support base64 upload fallback
            'file_name' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $filePath = null;
        $fileName = $request->input('file_name');

        // Handle uploaded file (Multipart form)
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = $file->getClientOriginalName();
            $targetName = time() . '_' . $fileName;
            $file->move(public_path('uploads/materials'), $targetName);
            $filePath = '/uploads/materials/' . $targetName;
        } 
        // Handle Base64 file upload (JSON request fallback)
        elseif ($request->has('file_base64') && $request->input('file_base64')) {
            $base64Data = $request->input('file_base64');
            // e.g. data:application/pdf;base64,JVBERi0xLjQK...
            if (preg_match('/^data:([^;]+);base64,(.*)$/', $base64Data, $matches)) {
                $fileData = base64_decode($matches[2]);
                $fileName = $fileName ?: 'material_' . time() . '.pdf';
                $targetName = time() . '_' . $fileName;
                
                $dir = public_path('uploads/materials');
                if (!File::isDirectory($dir)) {
                    File::makeDirectory($dir, 0755, true, true);
                }
                
                File::put($dir . '/' . $targetName, $fileData);
                $filePath = '/uploads/materials/' . $targetName;
            }
        }

        $material = LearningMaterial::create([
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'level' => $request->input('level'),
            'skills' => $request->input('skills'),
            'category' => $request->input('category'),
            'file_name' => $fileName,
            'file_path' => $filePath,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Material uploaded successfully.',
            'data' => $material
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $material = LearningMaterial::find($id);

        if (!$material) {
            return response()->json([
                'status' => 'error',
                'message' => 'Material not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'level' => 'required|string|max:255',
            'skills' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx|max:5120',
            'file_base64' => 'nullable|string',
            'file_name' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $fileName = $request->input('file_name', $material->file_name);
        $filePath = $material->file_path;

        // Handle file change
        if ($request->hasFile('file')) {
            // Delete old file
            if ($material->file_path && File::exists(public_path($material->file_path))) {
                File::delete(public_path($material->file_path));
            }

            $file = $request->file('file');
            $fileName = $file->getClientOriginalName();
            $targetName = time() . '_' . $fileName;
            $file->move(public_path('uploads/materials'), $targetName);
            $filePath = '/uploads/materials/' . $targetName;
        } elseif ($request->has('file_base64') && $request->input('file_base64')) {
            // Delete old file
            if ($material->file_path && File::exists(public_path($material->file_path))) {
                File::delete(public_path($material->file_path));
            }

            $base64Data = $request->input('file_base64');
            if (preg_match('/^data:([^;]+);base64,(.*)$/', $base64Data, $matches)) {
                $fileData = base64_decode($matches[2]);
                $fileName = $fileName ?: 'material_' . time() . '.pdf';
                $targetName = time() . '_' . $fileName;
                
                $dir = public_path('uploads/materials');
                if (!File::isDirectory($dir)) {
                    File::makeDirectory($dir, 0755, true, true);
                }
                
                File::put($dir . '/' . $targetName, $fileData);
                $filePath = '/uploads/materials/' . $targetName;
            }
        }

        $material->update([
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'level' => $request->input('level'),
            'skills' => $request->input('skills'),
            'category' => $request->input('category'),
            'file_name' => $fileName,
            'file_path' => $filePath,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Material updated successfully.',
            'data' => $material
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $material = LearningMaterial::find($id);

        if (!$material) {
            return response()->json([
                'status' => 'error',
                'message' => 'Material not found.'
            ], 404);
        }

        // Clean up file
        if ($material->file_path && File::exists(public_path($material->file_path))) {
            File::delete(public_path($material->file_path));
        }

        $material->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Material deleted successfully.'
        ]);
    }
}
