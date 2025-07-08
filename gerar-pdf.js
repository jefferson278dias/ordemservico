window.addEventListener('load', async function () {
  
  const dadosOS = JSON.parse(localStorage.getItem('dadosOS'));
  if (dadosOS) {
    document.getElementById('numero-os').textContent = dadosOS.numeroOS || '';
    document.getElementById('cliente').textContent = dadosOS.cliente || '';
    document.getElementById('tecnico').textContent = dadosOS.tecnico || '';
    document.getElementById('endereco').textContent = dadosOS.endereco || '';
    document.getElementById('data-agendada').textContent = dadosOS.data || '';
    document.getElementById('cliente-assinatura').textContent = dadosOS.cliente || '';

    const softwareSpan = document.getElementById('software');
    if (dadosOS.funcionalidades && dadosOS.funcionalidades.length > 0) {
      softwareSpan.textContent = dadosOS.funcionalidades.join(", ");
    } else {
      softwareSpan.textContent = 'Não informado';
    }
  }

 
  const canvas = document.getElementById('signature-pad');
  if (!canvas) {
    console.error('Canvas de assinatura não encontrado');
    return;
  }

  const signaturePad = new SignaturePad(canvas);

  const clearButton = document.getElementById('clear-signature');
  const gerarPdfBtn = document.getElementById('btnGerarPdf');

  if (!clearButton || !gerarPdfBtn) {
    console.error('Botões não encontrados');
    return;
  }

  clearButton.addEventListener('click', () => {
    signaturePad.clear();
  });

  gerarPdfBtn.addEventListener('click', async () => {
    
    clearButton.style.display = 'none';
    gerarPdfBtn.style.display = 'none';

   
    document.body.classList.add('print-layout');

    
    const originalBorder = canvas.style.border;
    canvas.style.border = 'none';

    
    const originalOpacity = canvas.style.opacity;
    canvas.style.opacity = '0';

    const conteudo = document.getElementById('conteudo-os');
    if (!conteudo) {
      console.error('Conteúdo da OS não encontrado');
      return;
    }

 
    let assinaturaImg = '';
    if (!signaturePad.isEmpty()) {
      assinaturaImg = signaturePad.toDataURL();
    }

   
    const canvasHtml = await html2canvas(conteudo, { scale: 2 });
    const imgData = canvasHtml.toDataURL('image/png');


    canvas.style.opacity = originalOpacity;
    canvas.style.border = originalBorder;

  
    document.body.classList.remove('print-layout');

  
    const pdf = new jspdf.jsPDF('p', 'pt', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const pdfAspectRatio = pdfWidth / pdfHeight;
    const imgAspectRatio = imgProps.width / imgProps.height;

    let renderWidth, renderHeight;
    if (imgAspectRatio > pdfAspectRatio) {
      renderWidth = pdfWidth;
      renderHeight = renderWidth / imgAspectRatio;
    } else {
      renderHeight = pdfHeight;
      renderWidth = renderHeight * imgAspectRatio;
    }

    const x = (pdfWidth - renderWidth) / 2;
    const y = (pdfHeight - renderHeight) / 2;

    
    pdf.addImage(imgData, 'PNG', x, y, renderWidth, renderHeight);

    
    const borderWidth = 1;
    pdf.setLineWidth(borderWidth);
    pdf.setDrawColor(180, 180, 180);
    pdf.rect(x - borderWidth / 2, y - borderWidth / 2, renderWidth + borderWidth, renderHeight + borderWidth);

  
    if (assinaturaImg) {
      const assinaturaWidth = 150;
      const assinaturaHeight = 70;
      const assinaturaX = x + 130;
      const assinaturaY = y + renderHeight - 140;
      pdf.addImage(assinaturaImg, 'PNG', assinaturaX, assinaturaY, assinaturaWidth, assinaturaHeight);
    }

    
    clearButton.style.display = 'inline-block';
    gerarPdfBtn.style.display = 'inline-block';

    
    pdf.save('ordem-servico.pdf');
  });
});
