import checkDependencies from '../check-dependencies.js'

export default {

  schema: {
    url: {
      type: 'string',
      default: ''
    },
    key: {
      type: 'string',
      default: ''
    },
    lightMapIntensity: {
      type: 'float'
    },
    lightMapCenter: {
      type: 'float'
    }
  },

  init: function () {
  },

  update: function () {
    var this_ = this
    var url = this_.data.url || this_.data.URL
    var key = this_.data.key || this_.data.KEY
    var lightMapIntensity = this_.data.lightMapIntensity
    var lightMapCenter = this_.data.lightMapCenter

    // check params
    if ((!url || url === '') && (!key || key === '')) return

    // remove old mesh
    this_.remove()

    // create new one
    this_.mesh = new THREE.Object3D()
    this_.data3dView = new IO3D.aFrame.three.Data3dView({parent: this_.mesh})
    this.el.data3dView = this.data3dView
    // load 3d file
    ;(key ? IO3D.storage.get(key) : IO3D.data3d.load(url)).then(function (data3d) {
      this_.el.data3d = data3d
      // update view
      this_.data3dView.set(data3d, {lightMapCenter: lightMapCenter, lightMapIntensity: lightMapIntensity})
      this_.el.setObject3D('mesh', this_.mesh)
      // emit event
      this_.el.emit('model-loaded', {format: 'data3d', model: this_.mesh});
    })
  },

  remove: function () {
    if (this.data3dView) {
      this.data3dView.destroy()
      this.data3dView = null
    }
    if (this.mesh) {
      this.el.removeObject3D('mesh')
      this.mesh = null
    }
  }

}
