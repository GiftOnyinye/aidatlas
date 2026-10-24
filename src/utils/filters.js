export function applyUniversityFilters(universities, filters) {
  return universities.filter((u) => {
    if (filters.country && filters.country.length > 0) {
      if (!filters.country.includes(u.country)) return false;
    }
    if (filters.type && filters.type.length > 0) {
      if (!filters.type.includes(u.type)) return false;
    }
    if (filters.major && filters.major.length > 0) {
      const hasMajor = filters.major.some(function (m) {
        return (u.majors || []).some(function (um) {
          return um.name.toLowerCase().indexOf(m.toLowerCase()) !== -1;
        });
      });
      if (!hasMajor) return false;
    }
    if (filters.needBased && u.needBasedAid !== 'available') return false;
    if (filters.meritAid && u.meritAid !== 'available') return false;
    if (filters.fullRide) {
      if (u.fullRide !== 'possible' && u.fullRide !== 'available') return false;
    }
    if (filters.internationalAid) {
      if (u.internationalAid !== 'available' && u.internationalAid !== 'limited') return false;
    }
    if (filters.testOptional) {
      const sat = (u.testing && u.testing.sat) || '';
      const isOptional = /optional|not required|not considered/i.test(sat);
      if (!isOptional) return false;
    }
    if (filters.feeWaiver) {
      const waiver = (u.application && u.application.feeWaiver) || '';
      if (!/yes|available/i.test(waiver)) return false;
    }
    if (filters.maxTuition) {
      const cost = u.estimatedTotalCost && u.estimatedTotalCost.amount;
      if (cost && cost > filters.maxTuition) return false;
    }
    return true;
  });
}

export function applyScholarshipFilters(scholarships, filters) {
  return scholarships.filter((s) => {
    if (filters.funding && filters.funding.length > 0) {
      if (filters.funding.indexOf(s.fundingType) === -1) return false;
    }
    if (filters.degree && filters.degree.length > 0) {
      const hasDegree = filters.degree.some(function (d) {
        return (s.eligibleDegrees || []).indexOf(d) !== -1;
      });
      if (!hasDegree) return false;
    }
    if (filters.field && filters.field.length > 0) {
      const hasField = filters.field.some(function (fl) {
        return (s.eligibleFields || []).some(function (ef) {
          return ef.toLowerCase().indexOf(fl.toLowerCase()) !== -1;
        });
      });
      if (!hasField) return false;
    }
    if (filters.country && filters.country.length > 0) {
      const hasCountry = filters.country.some(function (c) {
        const list = s.eligibleCountries || [];
        return list.indexOf(c) !== -1 || list.indexOf('All countries') !== -1;
      });
      if (!hasCountry) return false;
    }
    return true;
  });
}