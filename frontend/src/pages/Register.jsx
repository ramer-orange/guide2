import React, { useState } from 'react';
import { FormContainer, TextFieldElement, PasswordElement, PasswordRepeatElement } from 'react-hook-form-mui';
import { Box, Typography, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onSuccess = async (data) => {
    setError('');
    try {
      const response = await api.post('/register', data);
      
      // ログイン画面に遷移する前にトークンを保存
      if (response.data.token) {
        // トークンが返されている場合はログイン処理も一緒に行う
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/management'); // トークンがあれば直接管理画面へ
      } else {
        // トークンがなければログイン画面へ
        navigate('/login');
      }
    } catch (error) {
      console.error('登録に失敗しました:', error);
      if (error.response?.status === 422 && error.response?.data?.errors) {
        // バリデーションエラーの処理
        const errorMessages = Object.values(error.response.data.errors).flat();
        setError(errorMessages.join(' '));
      } else {
        setError('登録に失敗しました。もう一度お試しください。');
      }
    }
  };

  return (
    <Box maxW={360} mx="auto" mt={8} p={3} border={1} borderColor="divider" borderRadius={2}>
      <Typography variant="h5" align="center" gutterBottom>
        新規作成
      </Typography>

      {/* エラーメッセージ */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <FormContainer onSuccess={onSuccess}>
        <TextFieldElement
          name="name"
          label="お名前"
          required
        />
        < br />
        <TextFieldElement
          name="email"
          label="メールアドレス"
          required
        />
        < br />
        <PasswordElement
          name="password"
          label="パスワード"
          required
        />
        < br />
        <PasswordRepeatElement
          name='password_confirmation'
          label='パスワード確認'
          required
          passwordFieldName='password'
        />
        < br />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          登録
        </Button>
      </FormContainer>
    </Box>
  )
}