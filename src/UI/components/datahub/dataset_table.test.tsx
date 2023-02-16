import { render } from '../../test_config/render';
import { screen, fireEvent } from '@testing-library/dom';
import { Dataset } from '../../state/review/reviewSlice';
import { AppState } from '../../state/store';
import { initialState } from '../../state/config/configSlice';
import DatasetTable from './dataset_table';


describe('DatasetTable', () => {
    const datasetList: Dataset[] = [
        {
            UpdatedBy: 'userId1',
            UpdatedAt: '',
            ReviewedBy: [],
            ReviewedAt: [],
            ApprovedBy: [],
            ApprovedAt: [],
            doi: '',
            status: '',
            id: '', 
        },
    ];

    const state: Partial<AppState> = {
        review: {
            ...initialState,
            dataset_list: datasetList,
            review_dataset: {
                UpdatedBy: '',
                UpdatedAt: '',
                ReviewedBy: [],
                ReviewedAt: [],
                ApprovedBy: [],
                ApprovedAt: [],
                doi: '',
                status: '',
                id: '',
            },
            loading: false,
        },
    };

    it('renders all rows', () => {
        render(<DatasetTable />, state);
        expect(screen.getByTestId('row 1')).toBeInTheDocument();
        expect(screen.getByTestId('row 2')).toBeInTheDocument();
      });

    
})