export const bionomicsValidatorCheck = {
  'Adult data': { fieldType: 'boolean', nullable: true },
  'Larval site data': { fieldType: 'boolean', nullable: true },
  'Study/sampling design': { fieldType: 'boolean', nullable: true },
  'Contact authors': { fieldType: 'boolean', nullable: true },
  'Contact notes': { fieldType: 'string', nullable: true },
  'Secondary or general info': { fieldType: 'boolean', nullable: true },
  'Insecticide control': { fieldType: 'boolean', nullable: true },
  'ITN use?': { fieldType: 'boolean', nullable: true },
  Control: { fieldType: 'string', nullable: true },
  'Control notes': { fieldType: 'string', nullable: true },
  Month_st: { fieldType: 'number', nullable: true },
  Month_end: { fieldType: 'number', nullable: true },
  Year_st: { fieldType: 'number', nullable: true },
  Year_end: { fieldType: 'number', nullable: true },
  'Season (given)': { fieldType: 'string', nullable: true },
  'Season (calc)': { fieldType: 'string', nullable: true },
  'Season notes': { fieldType: 'string', nullable: true },
  'Data abstracted by': { fieldType: 'string', nullable: true },
  'Data checked by': { fieldType: 'string', nullable: true },
};

export const biologyValidatorCheck = {
  'Sampling (biology)_1': { fieldType: 'string', nullable: true },
  'Sampling (biology)_2': { fieldType: 'string', nullable: true },
  'Sampling (biology)_3': { fieldType: 'string', nullable: true },
  'Sampling (biology)_n': { fieldType: 'string', nullable: true },
  'Parity (n)': { fieldType: 'number', nullable: true },
  'Parity (total)': { fieldType: 'number', nullable: true },
  'Parity (%)': { fieldType: 'number', nullable: true },
  'Daily survival rate (%)': { fieldType: 'number', nullable: true },
  'Fecundity (mean batch size)': { fieldType: 'number', nullable: true },
  'Gonotrophic cycle (days)': { fieldType: 'number', nullable: true },
  'Biology notes': { fieldType: 'string', nullable: true },
};

export const infectionValidatorCheck = {
  'Sampling (infection)_1': { fieldType: 'string', nullable: true },
  'Sampling (infection)_2': { fieldType: 'string', nullable: true },
  'Sampling (infection)_3': { fieldType: 'string', nullable: true },
  'Sampling (infection)_n': { fieldType: 'string', nullable: true },
  'IR by CSP (n_pool)': { fieldType: 'number', nullable: true },
  'IR by CSP (total_pool)': { fieldType: 'number', nullable: true },
  'No. per pool': { fieldType: 'number', nullable: true },
  'IR by CSP (%)': { fieldType: 'number', nullable: true },
  'SR by dissection (n)': { fieldType: 'number', nullable: true },
  'SR by dissection (total)': { fieldType: 'number', nullable: true },
  'SR by dissection (%)': { fieldType: 'number', nullable: true },
  'SR by CSP (n)': { fieldType: 'number', nullable: true },
  'SR by CSP (total)': { fieldType: 'number', nullable: true },
  'SR by CSP (%)': { fieldType: 'number', nullable: true },
  'SR by Pf (n)': { fieldType: 'number', nullable: true },
  'SR by Pf (total)': { fieldType: 'number', nullable: true },
  'SR by P. falciparum': { fieldType: 'number', nullable: true },
  'Oocyst (n)': { fieldType: 'number', nullable: true },
  'Oocyst (total)': { fieldType: 'number', nullable: true },
  'Oocyst rate (%)': { fieldType: 'number', nullable: true },
  EIR: { fieldType: 'number', nullable: true },
  'EIR (period)': { fieldType: 'string', nullable: true },
  'Ext. incubation period (days)': { fieldType: 'number', nullable: true },
  'Infection notes': { fieldType: 'string', nullable: true },
};

export const bitingRateValidatorCheck = {
  'HBR sampling (indoor)': { fieldType: 'string', nullable: true },
  'Indoor HBR': { fieldType: 'number', nullable: true },
  'HBR sampling (outdoor)': { fieldType: 'string', nullable: true },
  'Outdoor HBR': { fieldType: 'number', nullable: true },
  'HBR sampling (combined)_1': { fieldType: 'string', nullable: true },
  'HBR sampling (combined)_2': { fieldType: 'string', nullable: true },
  'HBR sampling (combined)_3': { fieldType: 'string', nullable: true },
  'HBR sampling (combined)_n': { fieldType: 'string', nullable: true },
  'Combined HBR': { fieldType: 'number', nullable: true },
  'HBR (unit)': { fieldType: 'string', nullable: true },
  'ABR sampling_1': { fieldType: 'string', nullable: true },
  'ABR sampling_2': { fieldType: 'string', nullable: true },
  'ABR sampling_3': { fieldType: 'string', nullable: true },
  'ABR sampling_n': { fieldType: 'string', nullable: true },
  ABR: { fieldType: 'number', nullable: true },
  'ABR unit': { fieldType: 'string', nullable: true },
  'Biting rate notes': { fieldType: 'string', nullable: true },
};

export const anthropoZoophagicValidatorCheck = {
  'Host sampling (indoor)': { fieldType: 'number', nullable: true },
  'Indoor host (n)': { fieldType: 'number', nullable: true },
  'Indoor host (total)': { fieldType: 'number', nullable: true },
  'Indoor host %': { fieldType: 'number', nullable: true },
  'Host sampling (outdoor)': { fieldType: 'string', nullable: true },
  'Outdoor host (n)': { fieldType: 'number', nullable: true },
  'Outdoor host (total)': { fieldType: 'number', nullable: true },
  'Outdoor host %': { fieldType: 'number', nullable: true },
  'Host sampling (combined)_1': { fieldType: 'string', nullable: true },
  'Host sampling (combined)_2': { fieldType: 'string', nullable: true },
  'Host sampling (combined)_3': { fieldType: 'string', nullable: true },
  'Host sampling (combined)_n': { fieldType: 'string', nullable: true },
  'Combined host (n)': { fieldType: 'number', nullable: true },
  'Combined host (total)': { fieldType: 'number', nullable: true },
  'Combined host': { fieldType: 'number', nullable: true },
  'Host (unit)': { fieldType: 'string', nullable: true },
  'Host sampling (other)_1': { fieldType: 'string', nullable: true },
  'Host sampling (other)_2': { fieldType: 'string', nullable: true },
  'Host sampling (other)_3': { fieldType: 'string', nullable: true },
  'Host sampling (other)_n': { fieldType: 'string', nullable: true },
  'Other host (n)': { fieldType: 'number', nullable: true },
  'Other host (total)': { fieldType: 'number', nullable: true },
  'Host (other)': { fieldType: 'number', nullable: true },
  'Host (other) unit': { fieldType: 'string', nullable: true },
  'Host notes': { fieldType: 'string', nullable: true },
};

export const endoExophagicValidatorCheck = {
  'Biting -  No. of sampling nights (indoors)': {
    fieldType: 'number',
    nullable: true,
  },
  'Biting sampling (indoor)': { fieldType: 'string', nullable: true },
  'Indoor biting (n)': { fieldType: 'number', nullable: true },
  'Indoor biting (total)': { fieldType: 'number', nullable: true },
  'Indoor biting data': { fieldType: 'number', nullable: true },
  'Biting -  No. of sampling nights (outdoors)': {
    fieldType: 'number',
    nullable: true,
  },
  'Biting sampling (outdoor)': { fieldType: 'string', nullable: true },
  'Outdoor biting (n)': { fieldType: 'number', nullable: true },
  'Outdoor biting (total)': { fieldType: 'number', nullable: true },
  'Outdoor biting data': { fieldType: 'number', nullable: true },
  'Indoor/outdoor biting (unit)': { fieldType: 'string', nullable: true },
  'Indoor/outdoor biting notes': { fieldType: 'string', nullable: true },
};

export const bitingActivityValidatorCheck = {
  'Biting activity (indoor)  -  No. of sampling nights': {
    fieldType: 'number',
    nullable: true,
  },
  '18.30-21.30 (in)': { fieldType: 'number', nullable: true },
  '21.30-00.30 (in)': { fieldType: 'number', nullable: true },
  '00.30-03.30 (in)': { fieldType: 'number', nullable: true },
  '03.30-06.30 (in)': { fieldType: 'number', nullable: true },
  'Biting activity (outdoor)  -  No. of sampling nights': {
    fieldType: 'number',
    nullable: true,
  },
  '18.30-21.30 (out)': { fieldType: 'number', nullable: true },
  '21.30-00.30 (out)': { fieldType: 'number', nullable: true },
  '00.30-03.30 (out)': { fieldType: 'number', nullable: true },
  '03.30-06.30 (out)': { fieldType: 'number', nullable: true },
  'Biting activity (combined)  -  No. of sampling nights': {
    fieldType: 'number',
    nullable: true,
  },
  '18.30-21.30 (combined)': { fieldType: 'number', nullable: true },
  '21.30-00.30 (combined)': { fieldType: 'number', nullable: true },
  '00.30-03.30 (combined)': { fieldType: 'number', nullable: true },
  '03.30-06.30 (combined)': { fieldType: 'number', nullable: true },
  'Biting notes': { fieldType: 'string', nullable: true },
};

export const endoExophilyValidatorCheck = {
  'Resting sampling (indoor)': { fieldType: 'string', nullable: true },
  'Unfed (indoor)': { fieldType: 'number', nullable: true },
  'Fed (indoor)': { fieldType: 'number', nullable: true },
  'Gravid (indoor)': { fieldType: 'number', nullable: true },
  'Total (indoor)': { fieldType: 'number', nullable: true },
  'Resting sampling (outdoor)': { fieldType: 'string', nullable: true },
  'Unfed (outdoor)': { fieldType: 'number', nullable: true },
  'Fed (outdoor)': { fieldType: 'number', nullable: true },
  'Gravid (outdoor)': { fieldType: 'number', nullable: true },
  'Total (outdoor)': { fieldType: 'number', nullable: true },
  'Resting sampling (other)': { fieldType: 'string', nullable: true },
  'Unfed (other)': { fieldType: 'number', nullable: true },
  'Fed (other)': { fieldType: 'number', nullable: true },
  'Gravid (other)': { fieldType: 'number', nullable: true },
  'Total (other)': { fieldType: 'number', nullable: true },
  'Resting (unit)': { fieldType: 'string', nullable: true },
  'Resting notes': { fieldType: 'string', nullable: true },
};

export const environmentValidatorCheck = {
  Roof: { fieldType: 'string', nullable: true },
  Walls: { fieldType: 'string', nullable: true },
  'House screening': { fieldType: 'string', nullable: true },
  'Open eaves': { fieldType: 'string', nullable: true },
  Cooking: { fieldType: 'string', nullable: true },
  'Housing notes': { fieldType: 'string', nullable: true },
  Occupation: { fieldType: 'string', nullable: true },
  'Outdoor activities at night': { fieldType: 'string', nullable: true },
  'Sleeping outdoors': { fieldType: 'string', nullable: true },
  'Community notes': { fieldType: 'string', nullable: true },
  Farming: { fieldType: 'string', nullable: true },
  'Farming notes': { fieldType: 'string', nullable: true },
  Livestock: { fieldType: 'string', nullable: true },
  'Livestock notes': { fieldType: 'string', nullable: true },
  'Local plants': { fieldType: 'string', nullable: true },
};
