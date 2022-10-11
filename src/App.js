import {useState, useEffect}  from "react";
import {getAllStudents} from "./client.js";
import {deleteStudent} from "./client.js";
import {successNotification} from "./notification.js";
import {errorNotification} from "./notification.js"


import {
    Layout,
    Menu,
    Breadcrumb,
    Table,
    Spin,
    Empty,
    Button,
    Badge,
    Tag,
    Avatar,
    Radio, Popconfirm
} from "antd";

import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
    LoadingOutlined, DownloadOutlined, PlusOutlined
} from '@ant-design/icons';
import StudentDrawerForm from "./StudentDrawerForm.js";
import {studentId} from "./client.js";
import './App.css';

const { Header, Content, Footer, Sider } = Layout;
const {SubMenu} = Menu;
const TheAvatar = ({name}) =>{
    let trim = name.trim();
    if(trim.length === 0){
        return <Avatar icon={<UserOutlined/>} />
    }
    const split = trim.split(" ");
    if(split === 1){
    return <Avatar>{name.charAt(0)}</Avatar>
    }
    return <Avatar>{`${name.charAt(0)}${name.charAt(name.length-1)}`}</Avatar>
}
const removeStudent = (studentId, callback) => {
  deleteStudent(studentId).then(()=>{
            successNotification("student deleted", `student with  ${studentId} has deleted from our system`);

            }).catch(err => {
                console.log(err)
                err.response.json().then(res => {
                    console.log(res);
                    errorNotification("Student does not exist", `${res.message}[${res.status}][${res.error}]`)
                });
            }).finally(()=>callback())
}

const column = fetchStudents =>  [
    {
       title: '',
       dataIndex: 'avatar',
       key: 'avatar',
       render: (text, student) => <TheAvatar name={student.name} />
    },
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, student) =>
                    <Radio.Group>
                        <Popconfirm
                            title= {`Are you sure to delete ${student.name}`}
                            onConfirm={() => removeStudent(student.id, fetchStudents)}
                            okText="Yes"
                            cancelText="No" >
                            <Radio.Button value="small">Delete</Radio.Button>
                          </Popconfirm>
                            <Radio.Button value="small">Edit</Radio.Button>
                    </Radio.Group>

    }
];

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function App() {
    const [students, setStudents] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [fetch, setFetch] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);

    const fetchStudents = () =>
        getAllStudents()
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setStudents(data);

            }).catch(err =>{
                console.log(err.response)
                err.response.json().then(res => {
                    console.log(res);
                    errorNotification("There was an issue", `${res.message}[${res.status}][${res.error}]`)
                });
            }).finally(() => setFetch(false));
    useEffect( () => {
        console.log("component is mounted");
        fetchStudents();
    }, []);

    const renderStudents = () => {
        if (fetch){
         return <Spin indicator={antIcon} />;
        }
        if(students.length <= 0){

            return <>

                    <Button
                        onClick ={()=> setShowDrawer(!showDrawer)}
                        type="primary" icon={<PlusOutlined />} size="small">
                       Add New Student
                    </Button>
                    <StudentDrawerForm
                        showDrawer={showDrawer}
                        setShowDrawer={setShowDrawer}
                        fetchStudents={fetchStudents}
                    />
                     <Empty />
            </>
        }
        return <>
            <StudentDrawerForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchStudents={fetchStudents}
            />
            <Table

                dataSource={students}
                columns={column(fetchStudents)}
                bordered
                title={() =>
                    <>
                        <Tag color="red">Number of student Registered</Tag>
                        <Badge count={students.length} />
                        <br/><br/>
                        <Button
                            onClick ={()=> setShowDrawer(!showDrawer)}
                            type="primary" icon={<PlusOutlined />} size="small">
                           Add New Student
                         </Button>
                    </>
                     }
                pagination={{ pageSize: 50}}
                scroll={{y:500}}
                rowKey ={(student) => student.id}/>
         </>
    }


    return <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed}
               onCollapse={setCollapsed}>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1" icon={<PieChartOutlined />}>
                    Option 1
                </Menu.Item>
                <Menu.Item key="2" icon={<DesktopOutlined />}>
                    Option 2
                </Menu.Item>
                <SubMenu key="sub1" icon={<UserOutlined />} title="User">
                    <Menu.Item key="3">Tom</Menu.Item>
                    <Menu.Item key="4">Bill</Menu.Item>
                    <Menu.Item key="5">Alex</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                    <Menu.Item key="6">Team 1</Menu.Item>
                    <Menu.Item key="8">Team 2</Menu.Item>
                </SubMenu>
                <Menu.Item key="9" icon={<FileOutlined />}>
                    Files
                </Menu.Item>
            </Menu>
        </Sider>
        <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }} />
            <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                    {renderStudents()}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>By Teddy</Footer>
        </Layout>
    </Layout>
}

export default App;