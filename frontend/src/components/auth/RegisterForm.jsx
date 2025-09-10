import React from 'react';
import { FormContainer, TextFieldElement, PasswordElement, PasswordRepeatElement } from 'react-hook-form-mui';
import { Box, Typography, Button, Alert, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const RegisterForm = ({ onSubmit, error, loading }) => {
  return (
    <Box maxW={360} mx="auto" mt={8} p={3} border={1} borderColor="divider" borderRadius={2}>
      <Typography variant="h5" align="center" gutterBottom>
        新規作成
      </Typography>

      {/* エラーメッセージ */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <FormContainer onSuccess={onSubmit}>
        <TextFieldElement
          name="name"
          label="お名前"
          required
        />
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
        <PasswordRepeatElement
          name='password_confirmation'
          label='パスワード確認'
          required
          passwordFieldName='password'
        />
        <br />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? '登録中...' : '登録'}
        </Button>
        
        {/* ログインへのリンク */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            既にアカウントをお持ちの方は{' '}
            <Link component={RouterLink} to="/login">
              ログイン
            </Link>
          </Typography>
        </Box>
      </FormContainer>
    </Box>
  );
};
