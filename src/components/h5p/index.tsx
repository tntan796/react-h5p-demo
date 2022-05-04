import React from 'react';

// import H5PPlayerUI from './h5p/H5PPlayerUI';
import H5PEditorUI from './H5PEditorUI';
import { IEditorModel, IContentMetadata } from '@lumieducation/h5p-server';


// function formatEditor(editor: any): IEditorModel {

//     console.log("editor...", editor)
//     return {
//         integration: editor.integration,
//         scripts: editor.scripts,
//         styles: editor.styles,
//         urlGenerator: editor.urlGenerator
//     };  
// }

function formatContent(editor: any): {
    contentId: string;
    metadata: IContentMetadata;
} {
    console.log("Tying to format coantent")

    return {
        contentId: editor.contentId,
        metadata: editor.metadata,
    };
}


class H5PService {
    loadContentCallBack(contentId: string): Promise<IEditorModel> {
        return fetch('http://192.168.0.82:8080/contentModel')
        .then( r => {
            console.log(r)
            return r.json()
        })
        // return fetch('http://192.168.0.82:8080/contentModel')
        //     .then(res => {
        //         console.log(res)
        //         return res.json()
        //     })
        //     .then(res => formatEditor(res))
    }
    saveContentCallback(contentId:string, requestBody: {
        library: string;
        params: any;
    }): Promise<{
        contentId: string;
        metadata: IContentMetadata;
    }> {
        // Check if is Function is loaded in app start up
        console.log("Tying to format coantent....savecontentCallback")
        return fetch('http://192.168.0.82:8080/contentModel')
            .then(res => res.json())
            .then(res => formatContent(res))
    }
}

const apiClient = new H5PService();


const Editor = () => {

    return <div>
        <H5PEditorUI
            id='editor'
            contentId="new"
            loadContentCallback={async (contentId) => {
                /** retrieve content model from server and return it as Promise **/
                return await fetch('http://192.168.0.82:8080/contentModel')
                .then( r => {
                    console.log(r)
                    return r.json()
                })
            }}
            saveContentCallback={async (contentId, requestBody) => {
                /** save content on server **/

                return apiClient.saveContentCallback(contentId,requestBody )
            }}
        />
    </div>
}

export default Editor