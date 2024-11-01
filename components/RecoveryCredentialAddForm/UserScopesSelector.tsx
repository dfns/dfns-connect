import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Stack,
} from '@mui/material'
import { Box } from '@mui/system'
import React, { useCallback, useMemo } from 'react'
import { ApiEndpoint, ApiScope } from 'utils/api/constants'
import { useApiData } from 'utils/hooks/useApi'

type Props = {
  value: string[]
  onChange: (scopes: string[]) => void
  hideScopes?: string[]
}

export const ServiceAccountScopesSelector: React.FC<Props> = ({
  value: selectedScopes,
  onChange,
  hideScopes = [],
}) => {
  const { data: unfilteredApiScopes, isLoading } = useApiData(
    ApiEndpoint.listServiceAccountScopes
  )

  const apiScopes = useMemo(() => {
    return unfilteredApiScopes?.filter((s) => !hideScopes.includes(s.value))
  }, [hideScopes, unfilteredApiScopes])

  const toggle = useCallback(
    (selected: string[], toggledScope: string) => {
      const filteredScopes = selected.filter((s) => s !== toggledScope)
      if (filteredScopes.length === selected.length) {
        filteredScopes.push(toggledScope)
      }
      onChange(filteredScopes)
    },
    [onChange]
  )

  const scopeCategories = useMemo(() => {
    const categories = Array.from(
      new Set(apiScopes?.map((s) => getCategory(s.value)))
    )
    categories.sort()
    return categories.map((category) => ({
      category,
      scopes: getScopesOfCategory(category, apiScopes),
    }))
  }, [apiScopes])

  const isWholeCategorySelected = useCallback(
    (category: string, selected: string[]) => {
      return getScopesOfCategory(category, apiScopes).every((s) =>
        selected.includes(s.value)
      )
    },
    [apiScopes]
  )

  const onCategoryCheckboxChange = useCallback(
    (category: string, checked: boolean, selected: string[]) => {
      const areAllSelected = isWholeCategorySelected(category, selected)
      const scopesToAdd = getScopesOfCategory(category, apiScopes).map(
        (s) => s.value
      )
      const filteredOut = selected.filter((s) => getCategory(s) !== category)
      const updatedScopes = areAllSelected
        ? filteredOut
        : [...filteredOut, ...scopesToAdd]
      onChange(updatedScopes)
    },

    [apiScopes, onChange, isWholeCategorySelected]
  )

  if (isLoading) {
    return (
      <Box textAlign="center">
        <CircularProgress size={20} />
      </Box>
    )
  }

  return (
    <FormGroup>
      <Stack gap={2}>
        {scopeCategories?.map(({ category, scopes }) => (
          <Stack key={category}>
            <ScopeCheckBox
              value={category}
              label={category}
              checked={isWholeCategorySelected(category, selectedScopes)}
              onChange={(checked) =>
                onCategoryCheckboxChange(category, checked, selectedScopes)
              }
              fontWeight={600}
            />
            <Box paddingLeft={2}>
              {scopes.map((scope) => (
                <Stack direction="row" key={scope.value} alignItems="center">
                  <ScopeCheckBox
                    value={scope.value}
                    label={scope.value}
                    checked={selectedScopes.includes(scope.value)}
                    onChange={() => toggle(selectedScopes, scope.value)}
                  />
                  {/* <Typography flex={2} variant="caption" color="primary.light">
              This gives full admin access
            </Typography> */}
                </Stack>
              ))}
            </Box>
          </Stack>
        ))}
      </Stack>
    </FormGroup>
  )
}

const ScopeCheckBox: React.VFC<{
  value: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  fontWeight?: number
}> = ({ value, label, checked, onChange, fontWeight }) => {
  return (
    <FormControlLabel
      control={<Checkbox size="small" value={value} sx={{ padding: 0.5 }} />}
      label={label}
      sx={{
        '& .MuiSvgIcon-root': { fontSize: 18 },
        '& .MuiFormControlLabel-label': { fontSize: 13, fontWeight },
        flex: 1,
      }}
      checked={checked}
      onChange={(_, isChecked) => onChange(isChecked)}
    />
  )
}

const getCategory = (scope: string) => scope.split(':')[0]

const getScopesOfCategory = (category: string, scopes?: ApiScope[]) =>
  scopes?.filter((s) => getCategory(s.value) === category) || []
