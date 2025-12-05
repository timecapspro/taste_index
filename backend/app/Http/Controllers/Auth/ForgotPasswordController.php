<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use OpenApi\Annotations as OA;

class ForgotPasswordController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/auth/forgot-password",
     *     tags={"Auth"},
     *     summary="Запрос на сброс пароля",
     *     @OA\RequestBody(required=true,@OA\JsonContent(
     *         required={"login_or_email"},
     *         @OA\Property(property="login_or_email", type="string")
     *     )),
     *     @OA\Response(response=200, description="OK"),
     *     @OA\Response(response=404, description="User not found")
     * )
     */
    public function sendResetLinkEmail(Request $request)
    {
        $credentials = $request->validate([
            'login_or_email' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['login_or_email'])
            ->orWhere('login', $credentials['login_or_email'])
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Пользователь не найден'], 404);
        }

        $status = Password::sendResetLink(['email' => $user->email]);

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => __($status)]);
        }

        return response()->json(['message' => __($status)], 422);
    }
}
