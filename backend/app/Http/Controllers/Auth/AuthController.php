<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use OpenApi\Annotations as OA;

/**
 * @OA\Tag(name="Auth")
 */
class AuthController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/auth/register",
     *     tags={"Auth"},
     *     summary="Регистрация пользователя",
     *     @OA\RequestBody(required=true,@OA\JsonContent(
     *         required={"email","login","password","password_confirmation"},
     *         @OA\Property(property="email", type="string", format="email"),
     *         @OA\Property(property="login", type="string"),
     *         @OA\Property(property="password", type="string"),
     *         @OA\Property(property="password_confirmation", type="string"),
     *         @OA\Property(property="birth_date", type="string", format="date"),
     *         @OA\Property(property="language", type="string")
     *     )),
     *     @OA\Response(response=200, description="OK"),
     * )
     */
    public function register(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'login' => ['required', 'string', 'min:6', 'max:255', 'unique:users,login'],
            'password' => ['required', 'confirmed', 'min:8'],
            'birth_date' => ['nullable', 'date'],
            'language' => ['nullable', 'string', 'max:10'],
        ]);

        $user = User::create([
            'email' => $data['email'],
            'login' => $data['login'],
            'password' => Hash::make($data['password']),
            'birth_date' => $data['birth_date'] ?? null,
            'language' => $data['language'] ?? 'ru',
        ]);

        $user->sendEmailVerificationNotification();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
            'email_verified' => $user->hasVerifiedEmail(),
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/auth/login",
     *     tags={"Auth"},
     *     summary="Логин",
     *     @OA\RequestBody(required=true,@OA\JsonContent(
     *         required={"login_or_email","password"},
     *         @OA\Property(property="login_or_email", type="string"),
     *         @OA\Property(property="password", type="string"),
     *         @OA\Property(property="remember", type="boolean")
     *     )),
     *     @OA\Response(response=200, description="OK"),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'login_or_email' => ['required', 'string'],
            'password' => ['required', 'string'],
            'remember' => ['nullable', 'boolean'],
        ]);

        $user = User::where('email', $credentials['login_or_email'])
            ->orWhere('login', $credentials['login_or_email'])
            ->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'login_or_email' => ['Неверные учетные данные'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
            'email_verified' => $user->hasVerifiedEmail(),
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/auth/logout",
     *     security={{"sanctum":{}}},
     *     tags={"Auth"},
     *     summary="Выход",
     *     @OA\Response(response=200, description="OK")
     * )
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logged out']);
    }

    /**
     * @OA\Get(
     *     path="/api/auth/me",
     *     security={{"sanctum":{}}},
     *     tags={"Auth"},
     *     summary="Текущий пользователь",
     *     @OA\Response(response=200, description="OK")
     * )
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
