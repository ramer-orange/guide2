import React, { useState } from 'react';
import { FormContainer, TextFieldElement, PasswordElement } from 'react-hook-form-mui';
import { Box, Typography, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { login } = useAuth();

  const onSuccess = async (data) => {
    setError('');
    try {
      await login(data);
      
      navigate('/management');
    } catch (error) {
      console.error('ログインに失敗しました:', error.response || error);
      if (error.response?.status === 422 && error.response?.data?.errors) {
        // バリデーションエラーの処理
        const errorMessages = Object.values(error.response.data.errors).flat();
        setError(errorMessages.join(' '));
      } else {
        setError('ログインに失敗しました。メールアドレスまたはパスワードが正しくありません。');
      }
    }
  };

  return (
    <Box maxW={360} mx="auto" mt={8} p={3} border={1} borderColor="divider" borderRadius={2}>
      <Typography variant="h5" align="center" gutterBottom>
        ログイン
      </Typography>

      {/* エラーメッセージ */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <FormContainer onSuccess={onSuccess}>
        <br />
        <TextFieldElement
          name="email"
          label="メールアドレス"
          required
        />
        <br />
        <PasswordElement
          name="password"
          label="パスワード"
          required
        />
        <br />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          ログイン
        </Button>
      </FormContainer>
    </Box>
  );
}