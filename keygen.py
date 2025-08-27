import secrets

def random_hex(length):
    # Each byte gives 2 hex characters, so generate enough bytes
    return secrets.token_hex((length + 1) // 2)[:length]

print(random_hex(64))
