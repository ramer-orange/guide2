import React from 'react';
import { FormContainer, TextFieldElement, PasswordElement } from 'react-hook-form-mui';
import { Box, Typography, Button, Alert, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const LoginForm = ({ onSubmit, error, loading }) => {
  return (
    <Box maxW={360} mx="auto" mt={8} p={3} border={1} borderColor="divider" borderRadius={2}>
      <Typography variant="h5" align="center" gutterBottom>
        ログイン
      </Typography>

      {/* エラーメッセージ */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <FormContainer onSuccess={onSubmit}>
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
          disabled={loading}
        >
          {loading ? 'ログイン中...' : 'ログイン'}
        </Button>
        
        {/* 新規登録へのリンク */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            アカウントをお持ちでない方は{' '}
            <Link component={RouterLink} to="/register">
              新規登録
            </Link>
          </Typography>
        </Box>
      </FormContainer>
    </Box>
  );
};
