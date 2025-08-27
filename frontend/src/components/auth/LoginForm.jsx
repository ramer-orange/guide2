import React from 'react';
import { FormContainer, TextFieldElement, PasswordElement } from 'react-hook-form-mui';
import { Box, Typography, Button, Alert } from '@mui/material';

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
      </FormContainer>
    </Box>
  );
};
