import React from 'react'
import { FormContainer, TextFieldElement, PasswordElement } from 'react-hook-form-mui'
import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const onSuccess = data => {
    console.log(data)
    navigate('/')
  }

  return (
    <Box maxW={360} mx="auto" mt={8} p={3} border={1} borderColor="divider" borderRadius={2}>
      <Typography variant="h5" align="center" gutterBottom>
        ログイン
      </Typography>

      <FormContainer defaultValues={{ email: '', password: '' }} onSuccess={onSuccess}>
        <TextFieldElement
          name="email"
          label="メールアドレス"
          fullWidth
          required
          validation={{
            required: '必須です',
            pattern: { value: /^\S+@\S+$/, message: '正しいメールアドレスを入力してください' }
          }}
        />
        <PasswordElement
          name="password"
          label="パスワード"
          fullWidth
          required
          validation={{ required: '必須です', minLength: { value: 6, message: '6文字以上' } }}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          ログイン
        </Button>
      </FormContainer>
    </Box>
  )
}
