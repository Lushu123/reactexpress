module.exports = function (server) {
    //得到IO对象
    const io = require('socket.io')(server)
    //监视连接（当有一个用户连接上时回调）
    io.on('connection',function (socket) {
        //绑定sendMsg监听，接收客户端发送的消息
        socket.on('sendMsg',function (data) {
            console.log('服务器收到浏览器的消息',data)
            //向客户端发送消息（名称数据）
            //io.emit('receiveMsg',data.name + '_' + data.data)  //发送信息到所有连接到服务器的客户端
            socket.emit('receiveMsg',data.name + '_' + data.data)//发送信息到当前socket对应的客户端
            console.log('服务器向客户端发送消息',data)
        })

    })

}
