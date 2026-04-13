import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import SettingsPage from './page'
import * as tauriApi from '@tauri-apps/api/core'

// Mock the Tauri invoke function
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}))

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form initially', () => {
    render(<SettingsPage />)
    expect(screen.getByText('系统设置登录')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('请输入密码 (默认 admin123)')).toBeInTheDocument()
  })

  it('shows error on invalid login', async () => {
    vi.mocked(tauriApi.invoke).mockRejectedValueOnce(new Error('window.__TAURI_INTERNALS__ is not defined'))
    render(<SettingsPage />)
    
    const input = screen.getByPlaceholderText('请输入密码 (默认 admin123)')
    fireEvent.change(input, { target: { value: 'wrong' } })
    
    const button = screen.getByText('登录')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('密码错误，请重试')).toBeInTheDocument()
    })
  })

  it('logs in successfully and shows config form', async () => {
    vi.mocked(tauriApi.invoke).mockResolvedValueOnce(true) // login
    vi.mocked(tauriApi.invoke).mockResolvedValueOnce({ // get_agent_config
      name: "Test Agent",
      model: "gpt-4",
      temperature: 0.5,
      system_prompt: "Test prompt"
    })
    
    render(<SettingsPage />)
    
    const input = screen.getByPlaceholderText('请输入密码 (默认 admin123)')
    fireEvent.change(input, { target: { value: 'admin123' } })
    
    const button = screen.getByText('登录')
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('智能体配置 (Agent Config)')).toBeInTheDocument()
    })
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Agent')).toBeInTheDocument()
      expect(screen.getByDisplayValue('gpt-4')).toBeInTheDocument()
    })
  })
})
