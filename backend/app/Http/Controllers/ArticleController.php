<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $articles = Article::orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $articles
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json([
                'status' => 'error',
                'message' => 'Article not found.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $article
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
            'date_created' => 'nullable|string|max:255',
            'intro_paragraphs' => 'nullable|array',
            'intro_paragraphs.*' => 'nullable|string',
            'sections' => 'nullable|array',
            'sections.*.heading' => 'nullable|string',
            'sections.*.body' => 'nullable|string',
            'thumbnail' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $article = Article::create([
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'date_created' => $request->input('date_created', now()->format('d M Y')),
            'intro_paragraphs' => $request->input('intro_paragraphs', []),
            'sections' => $request->input('sections', []),
            'thumbnail' => $request->input('thumbnail'),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Article created successfully.',
            'data' => $article
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json([
                'status' => 'error',
                'message' => 'Article not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date_created' => 'nullable|string|max:255',
            'intro_paragraphs' => 'nullable|array',
            'intro_paragraphs.*' => 'nullable|string',
            'sections' => 'nullable|array',
            'sections.*.heading' => 'nullable|string',
            'sections.*.body' => 'nullable|string',
            'thumbnail' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $article->update([
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'date_created' => $request->input('date_created', $article->date_created),
            'intro_paragraphs' => $request->input('intro_paragraphs', $article->intro_paragraphs),
            'sections' => $request->input('sections', $article->sections),
            'thumbnail' => $request->input('thumbnail', $article->thumbnail),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Article updated successfully.',
            'data' => $article
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json([
                'status' => 'error',
                'message' => 'Article not found.'
            ], 404);
        }

        $article->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Article deleted successfully.'
        ]);
    }
}
