import React from 'react';
import { render } from '../../test_config/render';
import { screen, within } from '@testing-library/dom';
import SingleSource from './singleSource';
import SourcesView from '../../pages/source_list';
import { AppState } from '../../state/store';
import { initialState } from '../../state/sourceSlice';

describe(SourcesView.name, () => {
  it('renders the sources view', () => {
    const state: Partial<AppState> = {
      source: {
        ...initialState,
        source_info: [
          {
            author: 'testAuthor',
            article_title: 'testArticleTitle',
            journal_title: 'testJournalTitle',
            citation: 'testCitation',
            year: 0,
            published: true || false,
            report_type: 'testReportType',
            v_data: true || false,
          },
        ],
        source_info_status: '',
      },
    };
    render(<SourcesView />, state);
    expect(screen.getByTestId('sourceContainer')).toBeVisible();
  });
});

// describe('SingleSource component', () => {
//    it('renders', () => {
//       const sources = [{
//         author: 'testAuthor',
//         article_title: 'testArticleTitle',
//         journal_title: 'testJournalTitle',
//         citation: 'testCitation',
//         year: 0,
//         published: true || false,
//         report_type: 'testReportType',
//         v_data: true || false,
//       }];
//       render(
//         <SingleSource
//         author = ''
//         article_title = ''
//         journal_title = ''
//         citation = ''
//         year = {0}
//         published = {true}
//         report_type = ''
//         v_data = {true}
//            />
//       );
//       const singleSources = screen.getByTestId(`sourceContainer`).children.length;
//       expect(singleSources == sources.length);
//    });
//   });
