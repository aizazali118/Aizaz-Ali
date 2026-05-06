<?php
define('JWT_SECRET', '14c728349e5f9823d61b397345751a9062d507708399cdab13d4fc5b7468d29f6b8c09b73507ec88b787503a2fc3e39df6acf105cc048dc5c1178dc560eee1ba');
define('JWT_EXPIRY', 7 * 24 * 60 * 60); // 7 days

function jwt_encode(array $payload): string {
    $header  = b64u(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload['iat'] = time();
    $payload['exp'] = time() + JWT_EXPIRY;
    $payload = b64u(json_encode($payload));
    $sig     = b64u(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    return "$header.$payload.$sig";
}

function jwt_decode(string $token): array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) throw new Exception('Invalid token format');
    [$header, $payload, $sig] = $parts;
    $expected = b64u(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    if (!hash_equals($expected, $sig)) throw new Exception('Invalid signature');
    $data = json_decode(b64d($payload), true);
    if (!$data) throw new Exception('Invalid payload');
    if ($data['exp'] < time()) throw new Exception('Token expired');
    return $data;
}

function b64u(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function b64d(string $data): string {
    return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 4 - strlen($data) % 4));
}
