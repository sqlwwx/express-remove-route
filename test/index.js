var express = require('express');
var app = express();
var removeRoute = require('../');

function handleHello(req, res){
  res.status(200).send('hello ' + req.params.id);
}
app.get('/api/hello/:id', handleHello);
app.use('*', function (req, res) {
  res.status(404).send('404.2');
});

var req = require('supertest').agent(app.listen());
var should = require('should');
var urls = [
  '/api/hello/wwx',
  '/api/hello/wwx1',
  '/api/hello2'
];

describe('test dynamic route', function () {
  describe('初始route校验', function () {
    it('test route0', function (done) {
      req.get(urls[0]).expect(200).expect(function(res){
        res.text.should.eql('hello wwx');
      }).end(done);
    });
    it('test route1', function (done) {
      req.get(urls[1]).expect(200).expect(function(res){
        res.text.should.eql('hello wwx1');
      }).end(done);
    });
    it('test route2', function (done) {
      req.get(urls[2]).expect(404).expect(function (res){
        res.text.should.eql('404.2');
      }).end(done);
    });
  });
  describe('remove route校验', function () {
    before(function(done) {
      console.log(removeRoute(app, '/api/hello/:id', handleHello));
      done();
    });
    it('test route0', function (done) {
      req.get(urls[2]).expect(404).end(done);
    });
    it('test route1', function (done) {
      req.get(urls[2]).expect(404).end(done);
    });
    it('test route2', function (done) {
      req.get(urls[2]).expect(404).end(done);
    });
  });
  describe('add route校验', function () {
    before(function (done) {
      done();
      app.get('/api/hello/wwx', function (req, res) {
        res.status(200).send('hello2 wwx');
      });
    });
    it('test route0', function (done) {
      req.get(urls[0]).expect(200).expect(function(res){
        res.text.should.eql('hello2 wwx');
      }).end(done);
    });
    it('test route1', function (done) {
      req.get(urls[1]).expect(404).end(done);
    });
    it('test route2', function (done) {
      req.get(urls[2]).expect(404).end(done);
    });
  });
  describe('reAdd route校验', function () {
    before(function (done) {
      app.get('/api/hello/:id', handleHello);
      done();
    });
    it('test route0', function (done) {
      req.get(urls[0]).expect(200).expect(function(res){
        res.text.should.eql('hello2 wwx');
      }).end(done);
    });
    it('test route1', function (done) {
      req.get(urls[1]).expect(200).expect(function(res){
        res.text.should.eql('hello wwx1');
      }).end(done);
    });
    it('test route2', function (done) {
      req.get(urls[2]).expect(404).end(done);
    });
  });
});
