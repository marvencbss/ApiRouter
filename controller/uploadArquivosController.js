const fs = require('fs').promises;
const Upload = require('../modelo/Upload');

exports.uploadarquivo = async (req, res) => {
    console.log('uploadarquivo');

    const diretorioArquivo = req.file.path;
    const nomeArquivo = req.file.filename;
    console.log('uploadarquivo.diretorioArquivo:'+diretorioArquivo);
    console.log('uploadarquivo.nomeArquivo:'+nomeArquivo);
   

    try {
      const dados = await fs.readFile(diretorioArquivo);
      console.log('uploadarquivo.Conteudo do Arquivo:'+dados);

        if (!dados) {
          throw new Error('dadosArquivo é null');
        }
        
      const novoUpload = await Upload.create({ nomeArquivo, dados});
      res.status(201).json({ message: 'Upload realizado com sucesso', nomeArquivo });
    } catch (err) {
      console.log("Erro ao efetuar upload"+err);
      res.status(500).json({ message: 'Erro ao efetuar upload', nomeArquivo });
    }finally{
      console.log("Finally Apaga o arquivo temporario");
      await fs.unlink(diretorioArquivo);
    }
  };

  exports.getArquivo = async (req, res) => {
    try {
      const id = req.params.id;
      const upload = await Upload.findByPk(id);
  
      if (!upload) {
        return res.status(404).json({ message: 'Arquivo não encontrado' });
      }
  
      console.log('Nome do arquivo:', upload.nomeArquivo);
      console.log('Tamanho do arquivo encontrado:'+upload.dados.byteLength);
      console.log('Conteúdo do arquivo:', upload.dados);

      let contentType;
      if (upload.nomeArquivo.endsWith('.jpg') || upload.nomeArquivo.endsWith('.jpeg')) {
        console.log('image/jpeg');
        contentType = 'image/jpeg';

      } else if (upload.nomeArquivo.endsWith('.png')) {
        console.log('image/png');
        contentType = 'image/png';
      }if (upload.nomeArquivo.endsWith('.mp3')) {
        console.log('audio/mpeg');
          contentType = 'audio/mpeg';
      } else {
        console.log('application/octet-stream');
        contentType = 'application/octet-stream';
      }

      
      res.set('Content-Type', contentType);
      //res.set('Content-Disposition', `attachment; filename="${upload.nomeArquivo}"`);
      
      res.set('Content-Disposition', `inline; filename="${upload.nomeArquivo}"`);
      res.status(200).end(upload.dados);
   
    } catch (err) {
      console.log("Erro ao buscar o arquivo: " + err);
      res.status(500).json({ error: 'Erro ao buscar o arquivo' });
    }
  };