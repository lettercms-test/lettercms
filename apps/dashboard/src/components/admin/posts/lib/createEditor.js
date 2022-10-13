import {figureToImageBlock, imageToDataFigure, imageToEditFigure} from './converters';

async function createEditor(content) {
  const editor = window._editor = await window.ClassicEditor.create( document.querySelector( '#ck' ), {
    language:'es',
    rootName: 'main',
    initialData: content && typeof content === 'string'  ? content : '<p>Nueva super entrada</p>'
  });

  editor.model.schema.extend('imageBlock', { allowAttributes: ['data-src', 'data-user', 'data-profile'] });

  editor.conversion.for( 'upcast' ).elementToElement(figureToImageBlock);
  editor.conversion.for('dataDowncast').add(imageToDataFigure);
  editor.conversion.for( 'editingDowncast' ).add(imageToEditFigure);


  window.editorEventEmitter.on('insert', source => {
    editor.execute( 'insertImage', {
      source:  [source]
    });
    
    this.setState({
      showImagesModal: false
    });
  });
  
  window.editorEventEmitter.on('unsplash', ({user, href, src, download}) => {
    fetch('/api/track-image?url='+download.replace('https://api.unsplash.com/photos', ''));

    const docFrag = editor.model.change( writer => {

      const image =        writer.createElement('imageBlock', src);

      const container =    writer.createElement('paragraph', {alignment: 'center'});
      const photo =        writer.createText(`Photo by `);
      const userText =     writer.createText(user, {linkHref: href});
      const on =           writer.createText(' on ');
      const unsplashA =    writer.createText('Unsplash', {linkHref: 'https://unsplash.com/?utm_source=lettercms&utm_medium=referral'});
      const docFrag =      writer.createDocumentFragment();

      writer.append(photo, container);
      writer.append(userText, container);
      writer.append(on, container);
      writer.append(unsplashA, container);

      writer.append(image, docFrag);
      writer.append(container, docFrag);

      return docFrag;
    });

    editor.model.insertContent(docFrag);

    this.setState({
      showImagesModal: false
    });
  });

  const input = document.querySelector('input.ck-hidden');

  input.addEventListener('click', e => {
    e.preventDefault();

    this.setState({
      showImagesModal: true
    });
  });

  editor.model.document.on('change', (e) => {
    const nodes = e.source.roots._items[1]._children._nodes;

    const images = nodes
      .map(({name, _attrs}) => name === 'imageBlock' ? _attrs.get('data-src') : null)
      .filter(e => e);

    this.changes.images = images;
    this.changes.hasContent = true;

    this.setState({
      isSaved: false,
      images
    });

    if (this.state.postStatus !== 'published') {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.update(), 5000);
    }
  });

  return Promise.resolve(editor);
}

export default createEditor;
