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
    expect(
      screen.getByTestId(`sourceContainer`)
    ).toBeVisible();

  })
})













