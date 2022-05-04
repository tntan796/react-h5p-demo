import { useEffect, useState } from 'react';
import { ContentService, IContentService } from '../services/ContentService';

export function useContent(contentRoute:string) {

    const [content, setContent] = useState<IContentService>()

    useEffect(() => {
        
        if (!contentRoute) return;

        const newContentService = () => {

            setContent(new ContentService(contentRoute))
        }

        newContentService()

    },[contentRoute]);

    return content
}