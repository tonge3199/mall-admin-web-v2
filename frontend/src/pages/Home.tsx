import { Card, Col, Row, Statistic, Typography } from 'antd'

export function HomePage() {
    return (
        <div>
            <Typography.Title level={4}>仪表盘</Typography.Title>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Card><Statistic title="今日订单" value={0} /></Card>
                </Col>
                <Col span={6}>
                    <Card><Statistic title="今日销售额" prefix="¥" value={0} /></Card>
                </Col>
                <Col span={6}>
                    <Card><Statistic title="待发货" value={0} /></Card>
                </Col>
                <Col span={6}>
                    <Card><Statistic title="退款申请" value={0} /></Card>
                </Col>
            </Row>
        </div>
    )
}
