import React from 'react';
import { Editor as TinyMCEEditor } from 'tinymce';
import { Editor, IAllProps } from '@tinymce/tinymce-react';
import { uploadTinyMCEImageRoute } from '@omniapp-concept/common/dist/helpers/uploadTinyMCEImageRoute';

const lessonIdQueryPropName = 'lessonid';
const multerTinyMceImageFieldName = 'tinymceimage';

export type TinyMCEProps = {
  value: string;
  onChange: NonNullable< IAllProps[ 'onEditorChange' ] >;
  editorProps?: Partial< IAllProps >;
  init?: Partial< NonNullable< IAllProps[ 'init' ] > >;
};


export const TinyMCE: React.FC< TinyMCEProps > = React.memo( p => {
  const { value, onChange, editorProps, init } = p;
  const editorRef = React.useRef< TinyMCEEditor >();
  const onTinyInit = React.useCallback< NonNullable< IAllProps[ 'onInit' ] > >(
    ( evt, editor ) => {
      void evt;
      editorRef.current = editor;
    },
    [],
  );


  return (
    <Editor
      onInit={ onTinyInit }
      tinymceScriptSrc='/tinymce/tinymce.min.js'
      value={ value }
      onEditorChange={ onChange }
      init={ {
        language: 'uk',
        height: '100%',
        plugins: [
          // 'advlist',
          // 'autolink',
          'lists',
          'link',
          // 'save',
          // 'blocks',
          // 'image',
          // 'charmap',
          // 'print',
          // 'preview',
          // 'anchor',
          // 'searchreplace',
          // 'visualblocks',
          // 'code',
          'fullscreen',
          // 'insertdatetime',
          // 'media',
          'table',
          'image',
          // 'paste',
          // 'code',
          'help',
          // 'wordcount',
          // 'preview',
        ],
        // inline: true,
        // readonly: true,
        toolbar: [
          // { items: [ 'save' ], name: 'save' },
          { items: [ 'numlist', 'bullist' ], name: 'Lists' },
          { items: [ 'fullscreen' ], name: 'fullscreen' },
          { items: [ 'styles' ], name: 'styles' },
          // { items: [ 'media' ], name: 'Media' },
          { items: [ 'image' ], name: 'image' },
          { items: [ 'help' ], name: 'help' },
        ],
        table_column_resizing: 'resizetable',
        table_resize_bars: true,
        images_file_types: 'jpg,jpeg,png',
        relative_urls: false,
        image_caption: true,
        images_upload_handler: blobInfo => new Promise( r => {
          const xhr = new XMLHttpRequest();
          xhr.open( 'POST', `${ uploadTinyMCEImageRoute }?${ lessonIdQueryPropName }=123` );

          xhr.onload = () => {
            r( xhr.responseText );
          };

          const formData = new FormData();
          formData.append( multerTinyMceImageFieldName, blobInfo.blob(), blobInfo.filename() );

          xhr.send( formData );
        } ),
        contextmenu: 'link image table styles',
        // content_css: [
        //   // 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css',
        //   // '/styles.css',
        //   // '/tinymce/skins/ui/oxide/content.min.css',
        //   // '/tinymce/skins/content/default/content.min.css',
        // ],
        // object_resizing: 'img table',
        ...init,
      } }
      { ...editorProps }
    />
  );
} );
TinyMCE.displayName = 'components/TinyMCE';
