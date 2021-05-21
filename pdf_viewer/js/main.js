
const url = '../docs/pdf.pdf';

const download = document.getElementById('download');

let pdfDoc = null,
  pageNum = 1,
  pageIsRendering = false,
  pageNumIsPending = null;

let changes = []

const scale = 1.5,
  canvas = document.querySelector('#pdf-render'),
  ctx = canvas.getContext('2d');

// Render the page
const renderPage = num => {
  pageIsRendering = true;

  // Get page
  pdfDoc.getPage(num).then(page => {
    // Set scale
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderCtx = {
      canvasContext: ctx,
      viewport
    };

    page.render(renderCtx).promise.then(() => {
      pageIsRendering = false;

      if (pageNumIsPending !== null) {
        renderPage(pageNumIsPending);
        pageNumIsPending = null;
      }
    });

    console.log("render")
    // Output current page
    document.querySelector('#page-num').textContent = num;
  });
};

// Check for pages rendering
const queueRenderPage = num => {
  if (pageIsRendering) {
    pageNumIsPending = num;
  } else {
    renderPage(num);
  }
  
  if (changes.length !== 0 ){
    for (let i = 0;i<changes.length;i++){
      console.log("changes : ",changes[i].page_num)
      console.log("page : ",num)
      if (num == changes[i].page_num){
        console.log("here 2")
        ctx.font = '16px Arial';
        ctx.fillText(changes[i].txt, changes[i].x_pos, changes[i].y_pos-54.4);
        ctx.fillText("text", 100, 120-54.4);
      }
    }
  }
};

// Show Prev Page
const showPrevPage = () => {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
  ctx.font = '16px Arial';
  ctx.fillText("text", 100, 120-54.4);
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


download.addEventListener('click', function(e) {
  let width = canvas.width; 
  let height = canvas.height;

  //set the orientation
  if(width > height){
    pdf = new jsPDF('l', 'px', [width, height]);
  }
  else{
    pdf = new jsPDF('p', 'px', [height, width]);
  }
  pdf.addImage(canvas, 'PNG', 0, 0,width,height);
  for (let i =2 ; i <=pdfDoc.numPages;i++){
    queueRenderPage(i)
    sleep(1000).then(() => { 
      pdf.addPage()
      pdf.addImage(canvas, 'PNG', 0, 0,width,height);
    });
    
  }
  pdf.save("download.pdf");
});

const addText = event => {
  console.log("clicked")
  var x = event.clientX;     // Get the horizontal coordinate
  var y = event.clientY;  
  var text = document.getElementById('text').value

  ctx.font = '16px Arial';
  ctx.fillText(text, x, y-54.4);
  changes.push({txt:text,x_pos:x,y_pos:y,page_num:document.querySelector('#page-num').textContent})

}


// Show Next Page
const showNextPage = () => {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
  ctx.font = '16px Arial';
  ctx.fillText("text", 100, 120-54.4);
};

// Get Document
pdfjsLib
  .getDocument(url)
  .promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;

    document.querySelector('#page-count').textContent = pdfDoc.numPages;

    renderPage(pageNum);
  })
  .catch(err => {
    // Display error
    const div = document.createElement('div');
    div.className = 'error';
    div.appendChild(document.createTextNode(err.message));
    document.querySelector('body').insertBefore(div, canvas);
    // Remove top bar
    document.querySelector('.top-bar').style.display = 'none';
  });

// Button Events
document.querySelector('#prev-page').addEventListener('click', showPrevPage);
document.querySelector('#next-page').addEventListener('click', showNextPage);