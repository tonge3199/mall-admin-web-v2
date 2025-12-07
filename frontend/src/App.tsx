import { ConfigProvider } from 'antd'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes/router'
import { queryClient } from '@/app/query'
import { themeConfig } from '@/app/theme'

function App() {
  return (
    <ConfigProvider theme={themeConfig}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ConfigProvider>
  )
}

export default App
