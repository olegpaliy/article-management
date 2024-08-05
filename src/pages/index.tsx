import { ChangeEvent, useEffect, useState } from 'react'
import { api } from '~/utils/api'
import {
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  SelectChangeEvent,
} from '@mui/material'
import { useRouter } from 'next/router'

type SortOrder = 'asc' | 'desc'

const Home: React.FC = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    articleId: '',
    titleToUpdate: '',
    contentToUpdate: '',
    authorToUpdate: '',
    articleIdToUpdate: '',
    articleIdToDelete: '',
  })
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 5,
    sortBy: 'id',
    sortOrder: 'asc' as SortOrder,
    search: '',
  })

  const { page, pageSize, sortBy, sortOrder, search } = pagination

  const fetchAllArticles = api.article.getAll.useQuery(
    { page, pageSize, sortBy, sortOrder, search },
    { keepPreviousData: true }
  )
  const fetchOneArticle = api.article.getOne.useQuery(
    { id: formData.articleId },
    { enabled: false }
  )

  const createArticleMutation = api.article.createArticle.useMutation()
  const updateArticleMutation = api.article.updateArticle.useMutation()
  const deleteArticleMutation = api.article.deleteArticle.useMutation()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setPagination((prev) => ({ ...prev, search: value }))
  }

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target
    setPagination((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaginationChange = (e: ChangeEvent<unknown>, value: number) => {
    setPagination((prev) => ({ ...prev, page: value }))
  }

  const handleCreateArticle = async () => {
    try {
      await createArticleMutation.mutateAsync({
        title: formData.title,
        content: formData.content,
        author: formData.author,
      })
      setFormData({ ...formData, title: '', content: '', author: '' })
      fetchAllArticles.refetch()
    } catch (error) {
      router.push('/login')
      console.error(error)
    }
  }

  const handleUpdateArticle = async () => {
    try {
      await updateArticleMutation.mutateAsync({
        id: formData.articleIdToUpdate,
        title: formData.titleToUpdate,
        content: formData.contentToUpdate,
        author: formData.authorToUpdate,
      })
      setFormData({
        ...formData,
        titleToUpdate: '',
        contentToUpdate: '',
        authorToUpdate: '',
        articleIdToUpdate: '',
      })
      fetchAllArticles.refetch()
    } catch (error) {
      router.push('/login')
      console.error(error)
    }
  }

  const handleDeleteArticle = async () => {
    try {
      await deleteArticleMutation.mutateAsync({
        id: formData.articleIdToDelete,
      })
      setFormData({ ...formData, articleIdToDelete: '' })
      fetchAllArticles.refetch()
    } catch (error) {
      router.push('/login')
      console.error(error)
    }
  }

  useEffect(() => {
    fetchAllArticles.refetch()
  }, [page, pageSize, sortBy, sortOrder, search])

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Get All Articles
      </Typography>
      <Box display="flex" mb={2}>
        <TextField
          label="Search"
          variant="outlined"
          name="search"
          value={search}
          onChange={handleSearchChange}
          sx={{ mr: 2 }}
        />
        <FormControl sx={{ mr: 2 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            name="sortBy"
            value={sortBy}
            onChange={handleSelectChange}
            label="Sort By"
          >
            <MenuItem value="id">id</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="content">Content</MenuItem>
            <MenuItem value="author">Author</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ mr: 2 }}>
          <InputLabel>Order</InputLabel>
          <Select
            name="sortOrder"
            value={sortOrder}
            onChange={handleSelectChange}
            label="Order"
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={() => fetchAllArticles.refetch()}
        >
          Get All Articles
        </Button>
      </Box>

      <Grid container spacing={2} my={4}>
        <Grid item xs={3}>
          <Typography variant="h6">Id</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6">Title</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6">Content</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6">Author</Typography>
        </Grid>
      </Grid>

      {fetchAllArticles.data?.articles.map((article) => (
        <Paper key={article.id} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Typography>{article.id}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography>{article.title}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography>{article.content}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography>{article.author}</Typography>
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Pagination
        count={Math.ceil((fetchAllArticles.data?.totalCount ?? 0) / pageSize)}
        page={page}
        onChange={handlePaginationChange}
      />

      <Box my={4}>
        <Typography variant="h5" gutterBottom>
          Get One Article
        </Typography>
        <Box display="flex" mb={2}>
          <TextField
            label="Enter article id to get"
            variant="outlined"
            name="articleId"
            value={formData.articleId}
            onChange={handleChange}
            sx={{ mr: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => fetchOneArticle.refetch()}
          >
            Get One Article
          </Button>
        </Box>
        {fetchOneArticle.data && (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">
              Title: {fetchOneArticle.data.title}
            </Typography>
            <Typography>Content: {fetchOneArticle.data.content}</Typography>
            <Typography>Author: {fetchOneArticle.data.author}</Typography>
          </Paper>
        )}
      </Box>

      <Box my={4}>
        <Typography variant="h5" gutterBottom>
          Create New Article
        </Typography>
        <Box display="flex" mb={2}>
          <TextField
            label="Title"
            variant="outlined"
            name="title"
            value={formData.title}
            onChange={handleChange}
            sx={{ mr: 2 }}
          />
          <TextField
            label="Content"
            variant="outlined"
            name="content"
            value={formData.content}
            onChange={handleChange}
            sx={{ mr: 2 }}
          />
          <TextField
            label="Author"
            variant="outlined"
            name="author"
            value={formData.author}
            onChange={handleChange}
          />
        </Box>
        <Button
          variant="contained"
          color="success"
          onClick={handleCreateArticle}
        >
          Create Article
        </Button>
      </Box>

      <Box my={4}>
        <Typography variant="h5" gutterBottom>
          Update Article
        </Typography>
        <Box display="flex" mb={2}>
          <TextField
            label="Title to update"
            variant="outlined"
            name="titleToUpdate"
            value={formData.titleToUpdate}
            onChange={handleChange}
            sx={{ mr: 2 }}
          />
          <TextField
            label="Content to update"
            variant="outlined"
            name="contentToUpdate"
            value={formData.contentToUpdate}
            onChange={handleChange}
            sx={{ mr: 2 }}
          />
          <TextField
            label="Author to update"
            variant="outlined"
            name="authorToUpdate"
            value={formData.authorToUpdate}
            onChange={handleChange}
            sx={{ mr: 2 }}
          />
          <TextField
            label="Article id to update"
            variant="outlined"
            name="articleIdToUpdate"
            value={formData.articleIdToUpdate}
            onChange={handleChange}
          />
        </Box>
        <Button
          variant="contained"
          color="warning"
          onClick={handleUpdateArticle}
        >
          Update Article
        </Button>
      </Box>

      <Box my={4}>
        <Typography variant="h5" gutterBottom>
          Delete Article
        </Typography>
        <Box display="flex" mb={2}>
          <TextField
            label="Article id to delete"
            variant="outlined"
            name="articleIdToDelete"
            value={formData.articleIdToDelete}
            onChange={handleChange}
            sx={{ mr: 2 }}
          />
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteArticle}
          >
            Delete Article
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Home
