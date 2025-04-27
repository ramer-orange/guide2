import React, { useState } from 'react'
import axios from 'axios'
import { FormContainer, TextFieldElement, PasswordElement, PasswordRepeatElement } from 'react-hook-form-mui'
import { Box, Typography, Button, Alert, Snackbar } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const onSuccess = async (data) => {
    setError('')
    try {
      const response = await axios.post('/api/register', data, {
        headers: { 'Content-Type': 'application/json' }
      })
      console.log('API レスポンス:', response.data)
      navigate('/login');
    } catch (error) {
      console.error('登録に失敗しました:', error.response || error)
      if (error.response && error.response.data && error.response.data.errors) {
        // バリデーションエラーの処理
        const errorMessages = Object.values(error.response.data.errors).flat() // 1次元配列に変換
        setError(errorMessages.join(' '))
      } else {
        setError('登録に失敗しました。もう一度お試しください。')
      }
    }
  }

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