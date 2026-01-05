<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class PaystackService
{
    protected $baseUrl = 'https://api.paystack.co';
    protected $secretKey;

    public function __construct()
    {
        $this->secretKey = config('services.paystack.secret_key', env('PAYSTACK_SECRET_KEY'));
    }

    public function initializeTransaction($email, $amount, $reference, $callbackUrl = null)
    {
        $response = Http::withToken($this->secretKey)->post("{$this->baseUrl}/transaction/initialize", [
            'email' => $email,
            'amount' => $amount * 100, // Paystack expects amount in kobo
            'reference' => $reference,
            'callback_url' => $callbackUrl,
        ]);

        if ($response->successful()) {
            return $response->json();
        }

        throw new \Exception('Paystack initialization failed: ' . $response->body());
    }

    public function verifyTransaction($reference)
    {
        $response = Http::withToken($this->secretKey)->get("{$this->baseUrl}/transaction/verify/{$reference}");

        if ($response->successful()) {
            return $response->json();
        }

        throw new \Exception('Paystack verification failed: ' . $response->body());
    }
}
