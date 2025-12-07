import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
    return (
        <Result
            status="404"
            title="404"
            subTitle="页面不存在"
            extra={
                <Button type="primary">
                    <Link to="/home">返回首页</Link>
                </Button>
            }
        />
    )
}
