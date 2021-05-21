import React, {useEffect} from 'react'
import jsPDF from 'jspdf'
import pdfjsLib from "pdfjs-dist"

const Viewer = () => {

    const url = './docs/pdf.pdf';
    let pdfDoc = null;

    // useEffect(() => {
    //     const script1 = document.createElement('script');
    //     const script2 = document.createElement('script');
    //     const script3 = document.createElement('script');
    //     const script4 = document.createElement('script');
        
    //     script1.src = "https://mozilla.github.io/pdf.js/build/pdf.js";
    //     script1.async = true;
    //     script2.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js";
    //     script2.async = true;
    //     script3.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js";
    //     script3.async = true;
    //     script4.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.2/jspdf.min.js";
    //     script4.async = true;
        
    //     document.body.appendChild(script1);
    //     document.body.appendChild(script2);
    //     document.body.appendChild(script3);
    //     document.body.appendChild(script4);
        
    //     return () => {
    //         document.body.removeChild(script1);
    //         document.body.removeChild(script2);
    //         document.body.removeChild(script3);
    //         document.body.removeChild(script4);
    //     }
    // }, []);

    function renderPDF(url,canvasContainer){
        var scale = 1.5;

        function renderPage(page){
            var viewport = page.getViewport({scale})
            var canvas = document.createElement('canvas')
            canvas.classList.add(page._pageIndex)
            canvasContainer.appendChild(canvas)
            var ctx = canvas.getContext("2d")

        var renderContext = {
            canvasContext : ctx,
            viewport
        }

        canvas.height = viewport.height
        canvas.width = viewport.width

        
        page.render(renderContext).promise.then(()=> {
        })
        }

        function renderPages(pdfDoc){
            for(var num=1;num<=pdfDoc.numPages;num++){
                pdfDoc.getPage(num).then(page => {
                    renderPage(page);
                })
            }  
        }
        
        //pdfjsLib.disableWorker = true;

        pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
            pdfDoc = pdfDoc_
            document.querySelector('#page-count').textContent = pdfDoc.numPages;
            renderPages(pdfDoc)})
    }

    function addText(event) {
        console.log("clicked")
        var x = event.clientX;     // Get the horizontal coordinate
        var y = event.clientY;  
        var text = document.getElementById('text').value
        var canvas = document.getElementsByClassName(event.target.className)
        console.log(canvas)
        var ctx = canvas[0].getContext('2d')
        ctx.font = '16px Arial';
        if (event.target.className == 0){
            ctx.fillText(text, x, y-54.4);
        }
        else {
            ctx.fillText(text, x, y);
        }
        console.log(x,y)
    }

    function download(){
        var canvas = document.getElementsByTagName('canvas')
        
        let width = canvas[0].width; 
        let height = canvas[0].height;
        let pdf = null 

        //set the orientation
        if(width > height){
            pdf = new jsPDF('l', 'px', [width, height]);
        }
        else{
            pdf = new jsPDF('p', 'px', [height, width]);
        }
        pdf.addImage(canvas[0], 'PNG', 0, 0,width,height);
        for (let i =1 ; i <canvas.length;i++){
            pdf.addPage()
            pdf.addImage(canvas[i], 'PNG', 0, 0,width,height);   
        }
        pdf.save("download.pdf");            
    }

    function pdfRender(){
        renderPDF(url, document.getElementById("holder"))
    }

    

    return (
        <div>
            <div class="top-bar">
                <button class="btn" onclick={pdfRender}>
                    Render
                </button>
            <button class="btn" id="download" onclick={download}>
                Download
            </button>
            <input id="text"/>
            <span class="page-info">
                Total Page <span id="page-count"></span>
            </span>
            </div>
            <div id="holder" onclick={event => addText(event)}></div>
            <script src="https://mozilla.github.io/pdf.js/build/pdf.js"></script>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js" ></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.2/jspdf.min.js"></script>
        </div>
    )
}

export default Viewer
