var cl = require('node-opencl');
var fs = require('fs');
var express = require('express');
var http = require('http');
var logger = require('morgan');
var bodyParser = require('body-parser');
var os = require('os');
var tar = require('tar');
var uuid = require('node-uuid');

var app = express();

app.use(logger('combined'));

app.get('/v1.18/_ping', function (req, res) {

  res.json({
    message: 'pong'
  });

});

app.get('/v1.18/info', function (req, res) {
  res.json({
    Containers: 1,
    Images: 1,
    Driver: 'opencl-1.2',
    DriverStatus: [
      [ "" ]
    ],
    ExecutionDriver: "opencl-1.2",
    KernelVersion: "1.2",
    NCPU: 256,
    Memtotal: 2099236864, // total amount of video memory?
    Name: 'dockergpu',
    Debug: false,
    OperatingSystem: 'opencl-1.2',
    MemoryLimit: true,
    SwapLimit: true
  });
});

// list containers
app.get('/v1.18/containers/json', function (req, res) {

  res.json([
    {
      Id: 'abc123',
      Image: 'ubuntu:latest',
      Command: 'echo 1',
      Status: 'Exit 0',
      Ports: 'null',
      SizeRw: 12288,
      SizeRootFs: 0,
      Created: new Date().getTime(),
      Name: '/blahblah'
    },
    {
      Id: '123abc',
      Image: 'ubuntu:latest',
      Command: 'echo 1',
      Status: 'Exit 0',
      Ports: 'null',
      SizeRw: 12288,
      SizeRootFs: 0,
      Created: new Date().getTime(),
      Name: '/blahblahblah'
    }
  ]);

});

// get container details
app.get('/v1.18/containers/:id/json', function (req, res) {

  if (req.params.id == 'ubuntu') {

    return res.json(404, {
      message:' container not found'
    });

  }

  res.json({
    Id: req.params.id,
    Image: 'ubuntu:latest',
    Name: 'blahblah',
    State: {
      Error: "",
      ExitCode: 9,
      FinishedAt: new Date().getTime(),
      Paused: false,
      Pid: 0,
      Restarting: false,
      Running: false,
      StartedAt: new Date().getTime()
    }
  });

});

// get container stats
app.get('/v1.18/containers/:id/stats', function (req, res) {

  res.json({
    memory_stats: {

    },
    cpu_stats: {

    }
  });

});

// get container details
app.get('/v1.18/containers/:id/top', function (req, res) {

  res.json({
    Titles: [
      'USER',
      'PID'
    ],
    Processes: [
      [ "root", "20147" ]
    ]
  });

});

// get container logs
app.get('/v1.18/containers/:id/logs', function (req, res) {

  res.set('content-type', 'application/vnd.docker.raw-stream');
  res.set('connection', 'upgrade');
  res.set('upgrade', 'tcp');
  res.status(101);

  // FIXME

  setInterval(function () {

    res.send(JSON.stringify({
      log: 'asdfsdafsd',
      stream: 'stdout',
      container_id: 'abc123',
      time: new Date()
    }));

  }, 1000);

  res.end();

});

// delete a container
app.delete('/v1.18/containers/:id', function (req, res) {

  res.json(204, {
    message: 'container deleted'
  });

});

// create a container
app.post('/v1.18/containers/create', bodyParser.json(), function (req, res) {

  // lookup to ensure this image actually exists

  // if the image doesnt exist, then report an error

  // if the image does exist, then store this container with image

  // here we can do other kinds of validation with the launch parameters

  console.log('image', req.body.Image);

  res.json(201, {
    Id: 'abc123',
    Warnings: [

    ]
  });

});

// wait for container to stop/finish and return
app.post('/v1.18/containers/:id/wait', function (req, res) {

  // lookup the container by its id

  // poll or install handler to learn when execution completes

  res.json({
    StatusCode: 0
  });

});

// start a container
app.post('/v1.18/containers/:id/start', bodyParser.json(), function (req, res) {

  if (req.body.Detach) {
    console.log('container is detached mode');
  }

  if (req.body.Tty) {
    console.log('allocate a pseudo tty');
  }

  res.json(204, {
    message: 'container started'
  });

});

// build an image from raw data + dockerfile commands
app.post('/v1.18/images/create', function (req, res) {

  // client should send querystring: ?fromSrc=-

  // we should also apply an entrypoint here

  // scratch space for writing image files
  var tmpDir = os.tmpdir() + '/' + uuid.v4();
  console.log(tmpDir);

  // stream the contents from a tarball, unpack into directory
  req.pipe(tar.Extract({
    path: tmpDir
  })).on('end', function () {

    // verify the entrypoint exists

    // write the data output

    res.json(201, {
      message: 'image created'
    });

  });

});

// build an image from a build context + Dockerfile
app.post('/v1.18/build', function (req, res) {

  // stream the build context locally
  var tmpDir = os.tmpdir() + '/' + uuid.v4();
  console.log(tmpDir);

  // stream the contents from a tarball, unpack into directory
  req.pipe(tar.Extract({
    path: tmpDir
  })).on('end', function () {

    // read the dockerfile, support a strict subset of docker

    // verify the base image comes FROM scratch

    // verify the entrypoint exists

    res.json(200, {
      stream: 'build complete\n'
    });

  });

});

// inspect an image
app.get('/v1.18/images/:name/json', function (req, res) {

  res.json({
    Created: new Date(),
    Container: 'abc123',
    ContainerConfig: {
      Image: 'ubuntu'
    },
    Id: 'abc123',
    Parent: 'opencl-1.2',
    Cmd: [ '/bin/bash' ],
    Size: 100
  });

});

// list images
app.get('/v1.18/images/json', function (req, res) {

  res.json([
    {
      RepoTags: [
        'ubuntu:latest',
        'ubuntu:12.04'
      ],
      Id: 'abc123',
      Created: new Date().getTime(),
      Size: 100,
      VirtualSize: 0
    }
  ]);

});

// delete an image
app.delete('/v1.18/images/:name', function (req, res) {

  res.json([
    { Untagged: 'abc123' },
    { Deleted: 'abc123' }
  ]);

});

var server = http.createServer(app);
server.listen(3000);

var Square = function() {

  var ctx = cl.createContextFromType([cl.CONTEXT_PLATFORM, cl.getPlatformIDs()[0]], cl.DEVICE_TYPE_ALL, null, null);

  var inputs = new Buffer(10000 * 4);
  var outputs = new Buffer(10000 * 4);

  for (var i = 0; i < 10000; ++ i) {
    inputs.writeUInt32LE(i, i * 4);
  }

  // we should exact the binary from the named docker image
  var source = fs.readFileSync(__dirname + "/example/square.cl").toString();

  // we should read program from binary instead of source
  var prog = cl.createProgramWithSource(ctx, source);

  // link the program against the runtime
  cl.buildProgram(prog);

  // create an object for kernel invoaction
  var kern = cl.createKernel(prog, "square");

  // declare data buffers in host memory and track pointers
  var inputsMem = cl.createBuffer(ctx, cl.MEM_COPY_HOST_PTR, 10000 * 4, inputs);
  var outputsMem = cl.createBuffer(ctx, cl.MEM_COPY_HOST_PTR, 10000 * 4, outputs);

  // setup inputs to the kernel function
  cl.setKernelArg(kern, 0, "uint*", inputsMem);
  cl.setKernelArg(kern, 1, "uint*", outputsMem);
  cl.setKernelArg(kern, 2, "uint", 10000);

  // setup queue for piping commands to a gpu device
  var device = cl.getContextInfo(ctx, cl.CONTEXT_DEVICES)[0];
  var cq;

  if (cl.createCommandQueueWithProperties !== undefined) {
    cq = cl.createCommandQueueWithProperties(ctx, device, []);
  } else {
    cq = cl.createCommandQueue(ctx, device, null);
  }

  // this launches a kernel
  cl.enqueueNDRangeKernel(cq, kern, 1, null, [10000], null);

  // this reads the resulting memory buffer when kernel completes
  cl.enqueueReadBuffer(cq, outputsMem, true, 0, 10000 * 4, outputs);

  // we are finished with the processing queue, shut it down?
  cl.finish(cq);

  console.log("Last value is : " + outputs.readUInt32LE(40000 - 4));

};


Square();
