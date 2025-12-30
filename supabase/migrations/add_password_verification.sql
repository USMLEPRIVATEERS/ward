-- ============================================================================
-- ADD PASSWORD VERIFICATION FUNCTION
-- ============================================================================
-- Esta função permite verificar senhas de forma segura usando crypt

CREATE OR REPLACE FUNCTION verify_password(user_id UUID, input_password TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    stored_hash TEXT;
    is_valid BOOLEAN;
BEGIN
    -- Buscar o hash armazenado
    SELECT password_hash INTO stored_hash
    FROM users
    WHERE id = user_id;

    -- Se o usuário não existe, retornar false
    IF stored_hash IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Verificar se a senha corresponde ao hash
    -- A função crypt compara automaticamente usando o salt armazenado no hash
    is_valid := (crypt(input_password, stored_hash) = stored_hash);

    RETURN is_valid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Garantir que a função pode ser executada por usuários anônimos
GRANT EXECUTE ON FUNCTION verify_password(UUID, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION verify_password(UUID, TEXT) TO authenticated;

-- Comentário explicativo
COMMENT ON FUNCTION verify_password(UUID, TEXT) IS
'Verifica se uma senha corresponde ao hash armazenado para um usuário específico';
