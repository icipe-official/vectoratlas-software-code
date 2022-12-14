export const occurrenceValidatorCheck = {
  'Month Start': { fieldType: 'number', nullable: false },
  'Year Start': { fieldType: 'number', nullable: false },
  'Month End': { fieldType: 'number', nullable: false },
  'Year End': { fieldType: 'number', nullable: false },
  'DEC Id': { fieldType: 'string', nullable: false },
  'DEC Check': { fieldType: 'string', nullable: false },
  'Map Check': { fieldType: 'string', nullable: false },
  'Vector Notes': { fieldType: 'string', nullable: false },
  // Think about how to validate timestamp_start
};

export const sampleValidatorCheck = {
  'Mossamp Tech 1': { fieldType: 'string', nullable: false },
  n1: { fieldType: 'number', nullable: true },
  'Mossamp Tech 2': { fieldType: 'string', nullable: false },
  n2: { fieldType: 'number', nullable: true },
  'Mossamp Tech 3': { fieldType: 'string', nullable: false },
  n3: { fieldType: 'number', nullable: true },
  'Mossamp Tech 4': { fieldType: 'string', nullable: false },
  n4: { fieldType: 'number', nullable: true },
  'All n': { fieldType: 'number', nullable: true },
  Control: { fieldType: 'boolean', nullable: true },
  'Control Type': { fieldType: 'string', nullable: false },
};
