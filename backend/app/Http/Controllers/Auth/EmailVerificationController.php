<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use OpenApi\Annotations as OA;

class EmailVerificationController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/auth/email/verify/{id}/{hash}",
     *     tags={"Auth"},
     *     summary="Подтверждение email",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Parameter(name="hash", in="path", required=true, @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Verified")
     * )
     */
    public function verify(Request $request, $id, $hash)
    {
        $user = User::findOrFail($id);

        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return response()->json(['message' => 'Invalid verification link'], 400);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified']);
        }

        $user->markEmailAsVerified();
        event(new Verified($user));

        return response()->json(['message' => 'Email verified']);
    }

    /**
     * @OA\Post(
     *     path="/api/auth/email/resend",
     *     security={{"sanctum":{}}},
     *     tags={"Auth"},
     *     summary="Отправить письмо повторно",
     *     @OA\Response(response=200, description="Sent")
     * )
     */
    public function resend(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified']);
        }

        $user->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification link sent']);
    }
}
