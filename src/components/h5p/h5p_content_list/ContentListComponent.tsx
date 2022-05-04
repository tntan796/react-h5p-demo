import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

// The .js references are necessary for requireJs to work in the browser.
import { IContentService, IContentListEntry } from '../../../services/ContentService';
import ContentListEntryComponent from './ContentListEntryComponent';

const ContentList = (props) => {

    const [state, setState] = useState<{ contentList: IContentListEntry[] }>({ contentList: [] })
    const [contentService, setContent] = useState<IContentService>(props.contentService)

    /**
     * Keeps track of newly created content to assign a key
     * @memberof ContentList
    */
    const [newCounter, setCounter] = useState(0)

    useEffect(() => {
        const updateList = async () => {
            const contentList = await contentService.list();
            setState({ contentList });
        }
        updateList()
    }, [contentService])

    const onDiscard = (content) => {
        setState({ contentList: state.contentList.filter((c) => c !== content) });
    }

    const onDelete = async (content: IContentListEntry) => {
        if (!content.contentId) {
            return;
        }
        try {
            await contentService.delete(content.contentId);
            setState({
                contentList: state.contentList.filter((c) => c !== content)
            });
        } catch (error) {
            console.error(error.message);
        }
    }

    const onSaved = async (
        oldData: IContentListEntry,
        newData: IContentListEntry
    ) => {
        setState({
            contentList: state.contentList.map((c) =>
                c === oldData ? newData : c
            )
        });
    }

    const newH5P = () => {
        setState({
            contentList: [
                {
                    contentId: 'new',
                    mainLibrary: undefined,
                    title: 'New H5P',
                    originalNewKey: `new-${setCounter(newCounter + 1)}`
                },
                ...state.contentList
            ]
        });
    }

    return (
        <div>
            <Button
                variant="primary"
                onClick={() => newH5P()}
                className="my-2"
            >
                <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                    Create new content
                </Button>
            <ListGroup>
                {state.contentList.map((content) => (
                    <ContentListEntryComponent
                        contentService={contentService}
                        data={content}
                        key={content.originalNewKey ?? content.contentId}
                        onDiscard={() => onDiscard(content)}
                        onDelete={() => onDelete(content)}
                        onSaved={(newData) =>
                            onSaved(content, newData)
                        }
                        generateDownloadLink={
                            contentService.generateDownloadLink
                        }
                    ></ContentListEntryComponent>
                ))}
            </ListGroup>
        </div>
    );
}


export default ContentList