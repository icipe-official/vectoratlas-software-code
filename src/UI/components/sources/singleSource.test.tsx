import React from 'react';
import { render } from '../../test_config/render';
import { screen } from '@testing-library/dom';
import SingleSource from './singleSource';
import { Source } from '../../state/sourceSlice';

describe(SingleSource.name, () => {
  it('renders the sources view', () => {
    const source: Source = {
      author: 'testAuthor',
      article_title: 'testArticleTitle',
      journal_title: 'testJournalTitle',
      citation: 'testCitation',
      year: 0,
      published: true || false,
      report_type: 'testReportType',
      v_data: true || false,
      num_id: 1,
    };
    render(SingleSource(source));
    expect(screen.getByTestId('sourceContainer')).toBeVisible();
  });
});
