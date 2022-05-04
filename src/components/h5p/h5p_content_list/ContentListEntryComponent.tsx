import React, { useState } from 'react';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFingerprint,
    faBookOpen,
    faWindowClose,
    faSave,
    faCheck,
    faPlay,
    faPencilAlt,
    faFileDownload,
    faTrashAlt
} from '@fortawesome/free-solid-svg-icons';

import { H5PEditorUI, H5PPlayerUI } from '@lumieducation/h5p-react';

import { IContentListEntry, IContentService } from '../../../services/ContentService';
import './ContentListEntryComponent.css';

type propsInput = {
    contentService: IContentService;
    data: IContentListEntry;
    onDiscard: (content: IContentListEntry) => void;
    onDelete: (content: IContentListEntry) => void;
    onSaved: (data: IContentListEntry) => void;
    generateDownloadLink: (contentId: string) => string;
}

const  ContentListEntryComponent: React.FC<propsInput> = (props) => {

    const [state, setState] = useState<{
        editing: boolean;
        loading: boolean;
        playing: boolean;
        saved: boolean;
        saving: boolean;
        saveError: boolean;
        saveErrorMessage: string;
    }>({
        editing: props.data.contentId === 'new',
        playing: false,
        saving: false,
        saved: false,
        loading: true,
        saveErrorMessage: '',
        saveError: false
    })
    
    const h5pPlayer : React.RefObject<H5PPlayerUI> = React.createRef(); 
    const h5pEditor : React.RefObject<H5PEditorUI> = React.createRef();
    const saveButton : React.RefObject<HTMLButtonElement> = React.createRef();

    const play = () => {

        setState({...state, editing: false, playing: true })
    }

    const edit = () => {
        setState( {...state, editing: true, playing: false  })
    }

    const close = () => {
        setState({...state, editing: false, playing: false  });
    }

    const onPlayerInitialized = () => {
        
        setState({...state, loading: false  });
    };

    const save = async () => {
        setState({...state, saving: true })

        try {
            const returnData = await h5pEditor.current?.save();
            if (returnData) {
                await props.onSaved({
                    contentId: returnData.contentId,
                    mainLibrary: returnData.metadata.mainLibrary,
                    title: returnData.metadata.title,
                    originalNewKey: props.data.originalNewKey
                });
            }
        } catch (error) {
            // We ignore the error, as we subscribe to the 'save-error' and
            // 'validation-error' events.
        }
    }

    const onSaveError = async (event) => {

        setState({...state, saving: false,  saved: false, saveError: true,saveErrorMessage: event.detail.message });
       
        setTimeout(() => {
            setState( {...state, saveError: false } );
        }, 5000);
    };

    const onSaved = async (event) => {
        setState({...state, saving: false,saved: true  });
        setTimeout(() => {
            setState({...state, saved: false  });
        }, 3000);
    };

    const  onEditorLoaded = () => {
        setState({...state, loading: false });
    };

    const  isNew = () => {
        return props.data.contentId === 'new';
    }


    return (
            <ListGroupItem
                key={
                    props.data.originalNewKey ?? props.data.contentId
                }
            >
                <Container>
                    <Row>
                        <Col className="p-2">
                            <h5>{props.data.title}</h5>
                            <Row className="small">
                                <Col className="mr-2" lg="auto">
                                    <FontAwesomeIcon
                                        icon={faBookOpen}
                                        className="mr-1"
                                    />
                                    {props.data.mainLibrary}
                                </Col>
                                <Col className="mr-2" lg="auto">
                                    <FontAwesomeIcon
                                        icon={faFingerprint}
                                        className="mr-1"
                                    />
                                    {props.data.contentId}
                                </Col>
                            </Row>
                        </Col>
                        {state.playing ? (
                            <Col className="p-2" lg="auto">
                                <Button
                                    variant="light"
                                    onClick={() => close()}
                                    block
                                >
                                    <FontAwesomeIcon
                                        icon={faWindowClose}
                                        className="mr-2"
                                    />
                                    close player
                                </Button>
                            </Col>
                        ) : undefined}
                        {state.editing ? (
                            <Col className="p-2" lg="auto">
                                <Overlay
                                    target={saveButton.current}
                                    show={state.saveError}
                                    placement="right"
                                >
                                    <Tooltip id="error-tooltip">
                                        {state.saveErrorMessage}
                                    </Tooltip>
                                </Overlay>
                                <Button
                                    ref={saveButton}
                                    variant="primary"
                                    className={
                                        state.saving || state.loading
                                            ? 'disabled'
                                            : ''
                                    }
                                    disabled={
                                        state.saving || state.loading
                                    }
                                    onClick={() => save()}
                                    block
                                >
                                    {state.saving ? (
                                        <div
                                            className="spinner-border spinner-border-sm m-1 align-middle"
                                            role="status"
                                        ></div>
                                    ) : (
                                        <FontAwesomeIcon
                                            icon={faSave}
                                            className="mr-2"
                                        />
                                    )}{' '}
                                    save{' '}
                                    {state.saved ? (
                                        <FontAwesomeIcon
                                            icon={faCheck}
                                            className="mr-2"
                                        />
                                    ) : undefined}
                                </Button>
                            </Col>
                        ) : undefined}
                        {state.editing && !isNew() ? (
                            <Col className="p-2" lg="auto">
                                <Button
                                    variant="light"
                                    block
                                    onClick={() => close()}
                                >
                                    <FontAwesomeIcon
                                        icon={faWindowClose}
                                        className="mr-2"
                                    />
                                    close editor
                                </Button>
                            </Col>
                        ) : undefined}
                        {state.editing && isNew() ? (
                            <Col className="p-2" lg="auto">
                                <Button
                                    variant="light"
                                    block
                                    onClick={() =>
                                        props.onDiscard(props.data)
                                    }
                                >
                                    <FontAwesomeIcon
                                        icon={faWindowClose}
                                        className="mr-2"
                                    />
                                    discard
                                </Button>
                            </Col>
                        ) : undefined}
                        {!isNew() ? (
                            <React.Fragment>
                                <Col className="p-2" lg="auto">
                                    <Button
                                        variant="success"
                                        block
                                        onClick={() => play()}
                                    >
                                        <FontAwesomeIcon
                                            icon={faPlay}
                                            className="mr-2"
                                        />
                                        play
                                    </Button>
                                </Col>
                                <Col className="p-2" lg="auto">
                                    <Button
                                        variant="secondary"
                                        block
                                        onClick={() => edit()}
                                    >
                                        <FontAwesomeIcon
                                            icon={faPencilAlt}
                                            className="mr-2"
                                        />
                                        edit
                                    </Button>
                                </Col>{' '}
                                <Col className="p-2" lg="auto">
                                    <a
                                        href={props.generateDownloadLink(
                                            props.data.contentId
                                        )}
                                    >
                                        <Button variant="info" block>
                                            <FontAwesomeIcon
                                                icon={faFileDownload}
                                                className="mr-2"
                                            />
                                            download
                                        </Button>
                                    </a>
                                </Col>
                                <Col className="p-2" lg="auto">
                                    <Button
                                        variant="danger"
                                        block
                                        onClick={() =>
                                            props.onDelete(props.data)
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={faTrashAlt}
                                            className="mr-2"
                                        />
                                        delete
                                    </Button>
                                </Col>
                            </React.Fragment>
                        ) : undefined}
                    </Row>
                </Container>
                {state.editing ? (
                    <div
                        className={
                            props.data.contentId !== 'new' &&
                            state.loading
                                ? 'loading'
                                : ''
                        }
                    >
                        <H5PEditorUI
                            ref={h5pEditor}
                            contentId={props.data.contentId}
                            loadContentCallback={
                                props.contentService.getEdit
                            }
                            saveContentCallback={props.contentService.save}
                            onSaved={onSaved}
                            onLoaded={onEditorLoaded}
                            onSaveError={onSaveError}
                        />
                    </div>
                ) : undefined}
                {state.playing ? (
                    <div className={state.loading ? 'loading' : ''}>
                        <H5PPlayerUI
                            ref={h5pPlayer}
                            contentId={props.data.contentId}
                            loadContentCallback={
                                props.contentService.getPlay
                            }
                            onInitialized={onPlayerInitialized}
                            // xAPICallback={(
                            //     statement: any,
                            //     context: any,
                            //     event
                            // ) => console.log(statement, context, event)}
                        />
                        <div
                            style={{
                                visibility: state.loading
                                    ? 'visible'
                                    : 'collapse'
                            }}
                            className="spinner-border spinner-border-sm m-2"
                            role="status"
                        ></div>
                    </div>
                ) : undefined}
            </ListGroupItem>
        );
    }

export default ContentListEntryComponent;