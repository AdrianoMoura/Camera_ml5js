import 'p5/lib/addons/p5.sound'
import 'p5/lib/addons/p5.dom'
import ml5 from 'ml5'

let capture
let classifier
let labels = []

// Sketch scope
const sketch = (p5) => {

  // Variables scoped within p5
  const canvasWidth = p5.windowWidth
  const canvasHeight = p5.windowHeight
  const videoWidth = 1440
  const videoHeight = 1080
  // Video width will be a third of window width
  const videoWidthCanvas = canvasWidth/3
  // Video height will be proportional
  const videoHeightCanvas = videoWidthCanvas/videoWidth*videoHeight
  const videoPosX = (canvasWidth - videoWidthCanvas) / 2
  const videoPosY = 100

  // make library globally available
  window.p5 = p5

  // Setup function
  // ======================================
  p5.setup = () => {
    p5.createCanvas(canvasWidth, canvasHeight)
    p5.frameRate(10)
    capture = p5.createCapture(p5.VIDEO, () => console.log('video ready'))
    capture.size(videoWidth, videoHeight)
    capture.hide()
    
    classifier = ml5.imageClassifier('MobileNet', capture, modelReady)
  }

  // Draw function
  // ======================================
  p5.draw = () => {
    // Show camera capture as background
    p5.background(0)
    p5.image(capture, videoPosX, videoPosY, videoWidthCanvas, videoHeightCanvas)

    let labelX = canvasWidth/2
    let labelY = canvasHeight/2+100
    let labelColor = 255+80

    labels.forEach((label, index) => {
        // Show predictions
        p5.textSize(36)
        p5.textAlign(p5.CENTER)

        p5.fill(labelColor-=80)
        p5.text(`${label.className}`, 0, labelY+=80, canvasWidth)
    })
  }
}

const modelReady = (model) => {
    // Model is Ready, try to predict
    classifier.predict(gotResults)
}

const gotResults = (err, results) => {
    if (err) {
        console.error(err)
        return
    }
    
    // Predict result is received
    labels = results

    // Redo the prediction with 1s interval
    setTimeout(() => classifier.predict(gotResults), 500)
}

export default sketch