// pages/login.tsx
import React, { useState } from 'react'
import { TextField, Button, Container, Typography, Box } from '@mui/material'
import { useRouter } from 'next/router'
import { api, setToken } from '~/utils/api'

const LoginPage: React.FC = () => {
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const { mutate } = api.user.login.useMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      mutate(
        { email, password },
        {
          onSuccess(opts) {
            setToken(`Bearer ${opts}`)
            setError('')
            router.push('/')
          },
          onError() {
            setError('login failed')
          },
        }
      )
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          height: '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              sx={{
                margin: '8px 0 0 0',
              }}
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Login
            </Button>
          </form>
        </Box>
      </Box>
    </Container>
  )
}

export default LoginPage
