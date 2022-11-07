import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import SingleSource from './singleSource';
import SourcesView from '../../pages/source_list';


describe('SingleSource component', () => {
    it('renders', () => {
        const singleSources = screen.getByTestId(`sourceContainer`);
        const sources  =  screen.getByTestId(`sourceList`).children;
        for(let i=0; i < sources.length; i++){
          const source = sources[i];
          // let author = source.author;

        }
      render(
         <SingleSource 
            author={''} 
            article_title={''} 
            journal_title={''} 
            citation={''} 
            year={0} 
            published={false} 
            report_type={''} 
            v_data={false}/>
        );

    });
    
  });
  



